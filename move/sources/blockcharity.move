module blockcharity::fundraiser {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::table::{Self, Table};
    use sui::event;

    // --- Hata Kodları (Error Codes) ---
    const E_NOT_AUTHORIZED: u64 = 0;
    const E_CAMPAIGN_ENDED: u64 = 1;
    const E_TARGET_NOT_REACHED: u64 = 2;
    const E_CAMPAIGN_NOT_CANCELLED: u64 = 3;
    const E_NO_DONATION_FOUND: u64 = 4;

    // --- Durumlar (Statuses) ---
    const STATUS_ACTIVE: u8 = 0;
    const STATUS_SUCCESSFUL: u8 = 1;
    const STATUS_CANCELLED: u8 = 2;

    // --- Ana Obje: Kampanya ---
    struct Campaign has key, store {
        id: UID,
        creator: address,          // Kampanyayı başlatan kişi
        beneficiary: address,      // Paranın gideceği adres (Hastane/Kurum)
        target: u64,               // Hedef tutar (MIST cinsinden)
        current_amount: u64,       // Şu ana kadar toplanan
        status: u8,                // 0: Aktif, 1: Başarılı, 2: İptal
        balance: Balance<SUI>,     // Paranın fiziksel olarak durduğu yer
        donations: Table<address, u64> // Kim ne kadar yatırdı? (İade için kayıt defteri)
    }

    // --- Eventler (Frontend'in dinlemesi için) ---
    struct CampaignCreated has copy, drop {
        campaign_id: ID,
        creator: address,
        target: u64
    }

    struct CampaignSuccess has copy, drop {
        campaign_id: ID,
        amount_raised: u64,
        beneficiary: address
    }

    struct DonationReceived has copy, drop {
        campaign_id: ID,
        donor: address,
        amount: u64
    }
// YENİ EKLENEN EVENT: İade İşlemi Logu
    struct RefundClaimed has copy, drop {
        campaign_id: ID,
        donor: address,
        amount: u64
    }
    // --- 1. Kampanya Oluşturma (Create) ---
    public entry fun create_campaign(
        target: u64, 
        beneficiary: address, 
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Benzersiz bir ID oluştur
        let campaign_uid = object::new(ctx);
        let campaign_id = object::uid_to_inner(&campaign_uid);

        // Kampanya objesini hazırla
        let campaign = Campaign {
            id: campaign_uid,
            creator: sender,
            beneficiary: beneficiary,
            target: target,
            current_amount: 0,
            status: STATUS_ACTIVE,
            balance: balance::zero(), // Başlangıçta bakiye boş
            donations: table::new(ctx) // Boş bir defter aç
        };

        // Event fırlat (Frontend yakalasın)
        event::emit(CampaignCreated {
            campaign_id,
            creator: sender,
            target
        });

        // Objeyi paylaşılan (Shared) hale getir ki herkes bağış yapabilsin
        transfer::share_object(campaign);
    }

    // --- 2. Bağış Yapma (Donate) ---
    public entry fun donate(
        campaign: &mut Campaign, 
        payment: Coin<SUI>, 
        ctx: &mut TxContext
    ) {
        // Kampanya aktif mi kontrol et
        assert!(campaign.status == STATUS_ACTIVE, E_CAMPAIGN_ENDED);

        let amount = coin::value(&payment);
        let donor = tx_context::sender(ctx);
        let campaign_id = object::uid_to_inner(&campaign.id);

        // 1. Parayı Coin'den Balance'a çevirip kasaya koy
        let coin_balance = coin::into_balance(payment);
        balance::join(&mut campaign.balance, coin_balance);

        // 2. Sayaçları güncelle
        campaign.current_amount = campaign.current_amount + amount;

        // 3. Deftere yaz (Table)
        if (table::contains(&campaign.donations, donor)) {
            // Zaten bağış yapmışsa üzerine ekle
            let current_donation = table::borrow_mut(&mut campaign.donations, donor);
            *current_donation = *current_donation + amount;
        } else {
            // İlk kez yapıyorsa yeni satır ekle
            table::add(&mut campaign.donations, donor, amount);
        };

        // Event fırlat
        event::emit(DonationReceived {
            campaign_id,
            donor,
            amount
        });
        // 4. Hedefe ulaşıldı mı kontrol et
        if (campaign.current_amount >= campaign.target) {
            // 1. Durumu güncelle
            campaign.status = STATUS_SUCCESSFUL;

            // 2. Kasadaki TÜM parayı al
            let total_funds = balance::value(&campaign.balance);
            let cash = coin::take(&mut campaign.balance, total_funds, ctx);
            event::emit(CampaignSuccess {
                            campaign_id,
                            amount_raised: total_funds,
                            beneficiary: campaign.beneficiary
                        });
            // 3. Beneficiary'ye gönder
            transfer::public_transfer(cash, campaign.beneficiary);
        };
    }

    // --- 3. Parayı Çekme (Withdraw - Sadece Hedef Tutarsa) ---
    public entry fun withdraw_funds(
        campaign: &mut Campaign, 
        ctx: &mut TxContext
    ) {
        // Sadece kampanyayı oluşturan (veya admin) tetikleyebilir
        let sender = tx_context::sender(ctx);
        assert!(sender == campaign.creator, E_NOT_AUTHORIZED);

        // Hedef tuttu mu? (Opsiyonel: Esnek hedef istenirse bu satır kaldırılabilir)
        // assert!(campaign.current_amount >= campaign.target, E_TARGET_NOT_REACHED);

        // Kasayı tamamen boşalt
        let total_amount = balance::value(&campaign.balance);
        let cash = coin::take(&mut campaign.balance, total_amount, ctx);

        // Durumu güncelle
        campaign.status = STATUS_SUCCESSFUL;

        // Parayı belirlediğimiz "beneficiary" (Hastane) adresine yolla
        // Admin tetiklese bile para adminin cebine giremez!
        transfer::public_transfer(cash, campaign.beneficiary);
    }

    // --- 4. Kampanyayı İptal Etme (Admin) ---
    public entry fun cancel_campaign(
        campaign: &mut Campaign, 
        ctx: &mut TxContext
    ) {
        // Sadece creator yapabilir
        assert!(tx_context::sender(ctx) == campaign.creator, E_NOT_AUTHORIZED);
        
        campaign.status = STATUS_CANCELLED;
    }

    // --- 5. İade Alma (Refund - Sadece İptal Durumunda) ---
    public entry fun claim_refund(
        campaign: &mut Campaign, 
        ctx: &mut TxContext
    ) {
        // Kampanya iptal edilmiş olmalı
        assert!(campaign.status == STATUS_CANCELLED, E_CAMPAIGN_NOT_CANCELLED);

        let donor = tx_context::sender(ctx);

        // Bu kişi listede var mı?
        assert!(table::contains(&campaign.donations, donor), E_NO_DONATION_FOUND);

        // Ne kadar yatırmıştı?
        let donated_amount = table::remove(&mut campaign.donations, donor);

        // Kasadan o kadar parayı çıkar
        let refund_coin = coin::take(&mut campaign.balance, donated_amount, ctx);
        event::emit(RefundClaimed {
                    campaign_id: object::uid_to_inner(&campaign.id),
                    donor: donor,
                    amount: donated_amount
                });
        // Sahibine geri yolla
        transfer::public_transfer(refund_coin, donor);
    }
}