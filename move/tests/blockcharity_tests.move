#[test_only]
module blockcharity::fundraiser_tests {
    use sui::test_scenario;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    // Campaign struct'ını kullanabilmek için import etmemiz lazım
    use blockcharity::fundraiser::{create_campaign, cancel_campaign, donate, withdraw_funds, claim_refund, Campaign}; 

    const ADMIN: address = @0xA;
    const BENEFICIARY: address = @0xB;
    const DONOR1: address = @0xC;
    const DONOR2: address = @0xD;

    #[test]
    fun test_donation_and_withdrawal() {
        let mut test_scenario_instance = test_scenario::begin(ADMIN);
        
        // 1. ADIM: Kampanyayı Oluştur
        {
            let ctx = test_scenario::ctx(&mut scenario);
            create_campaign(1000, BENEFICIARY, ctx); // Kampanyayı oluşturuyoruz
        }

        // 2. ADIM: Bağış Yap (DONOR1)
        test_scenario::next_tx(&mut scenario, DONOR1);
        {
            let mut campaign = test_scenario::take_shared<Campaign>(&scenario); // Kampanyayı paylaşıyoruz
            let ctx = test_scenario::ctx(&mut scenario);
            
            // Test parası bas
            let donation_coin = coin::mint_for_testing<SUI>(100, ctx);
            
            // Bağış fonksiyonunu çağırıyoruz
            donate(&mut campaign, donation_coin, ctx);

            // Objeyi sahneye geri bırakıyoruz
            test_scenario::return_shared(campaign);
        }

        // 3. ADIM: Parayı Çek (ADMIN)
        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut campaign = test_scenario::take_shared<Campaign>(&scenario); // Kampanyayı alıyoruz
            let ctx = test_scenario::ctx(&mut scenario);

            withdraw_funds(&mut campaign, ctx); // Fonksiyonu çağırıyoruz

            // Objeyi sahneye geri bırakıyoruz
            test_scenario::return_shared(campaign);
        }

        // 4. ADIM: Kontrol (Beneficiary parayı aldı mı?)
        test_scenario::next_tx(&mut scenario, BENEFICIARY);
        {
            let funds = test_scenario::take_from_sender<Coin<SUI>>(&scenario);
            assert!(coin::value(&funds) == 100, 0); // 100 SUI gelmiş olmalı
            test_scenario::return_to_sender(&scenario, funds);
        }

        test_scenario::end(scenario);
    }

    #[test]
    fun test_refund_flow() {
        let mut test_scenario_instance = test_scenario::begin(ADMIN);
        
        // 1. Oluştur
        {
            let ctx = test_scenario::ctx(&mut test_scenario_instance);
            create_campaign(1000, BENEFICIARY, ctx);
        }

        // 2. Bağış Yap
        test_scenario::next_tx(&mut test_scenario_instance, DONOR1);
        {
            let mut campaign = test_scenario::take_shared<Campaign>(&test_scenario_instance); // Kampanyayı paylaşıyoruz
            let ctx = test_scenario::ctx(&mut test_scenario_instance);
            let coin = coin::mint_for_testing<SUI>(500, ctx);
            
            // Coin'i destroy etmek yerine donate fonksiyonuna veriyoruz
            donate(&mut campaign, coin, ctx);
            
            test_scenario::return_shared(campaign);
        }

        // 3. İptal Et (Admin)
        test_scenario::next_tx(&mut test_scenario_instance, ADMIN);
        {
            let mut campaign = test_scenario_instance::take_shared<Campaign>(&test_scenario_instance); // Kampanyayı paylaşıyoruz
            let ctx = test_scenario_instance::ctx(&mut test_scenario_instance);
            
            cancel_campaign(&mut campaign, ctx); // Kampanyayı iptal ediyoruz
            
            test_scenario_instance::return_shared(campaign);
        }

        // 4. İade Al (Donor1)
        test_scenario::next_tx(&mut test_scenario_instance, DONOR1);
        {
            let mut campaign = test_scenario::take_shared<Campaign>(&test_scenario_instance); // Kampanyayı paylaşıyoruz
            let ctx = test_scenario::ctx(&mut test_scenario_instance);
            
            claim_refund(&mut campaign, ctx); // İade alıyoruz
            
            test_scenario::return_shared(campaign);
        }

        test_scenario::end(test_scenario_instance);
    }

    #[test]
    // Hata kodunu fundraiser modülünden E_NOT_AUTHORIZED ile eşleşecek şekilde verebilirsin
    // Şimdilik genel bir hata beklediğimizi belirtiyoruz.
    #[expected_failure(abort_code = 1234)]  // E_NOT_AUTHORIZED ile eşleşen kodunuzu kullanın
    fun test_unauthorized_cancel() {
        let mut test_scenario_instance = test_scenario::begin(ADMIN);
        
        {
            let ctx = test_scenario::ctx(&mut test_scenario_instance);
            create_campaign(1000, BENEFICIARY, ctx);
        }

        test_scenario::next_tx(&mut test_scenario_instance, DONOR2); // Admin olmayan biri (DONOR2)
        {
            let mut campaign = test_scenario::take_shared<Campaign>(&test_scenario_instance); // Kampanyayı alıyoruz
            let ctx = test_scenario::ctx(&mut test_scenario_instance);
            
            // HATA VERMESİ BEKLENEN YER:
            // Admin olmayan biri iptal etmeye çalışıyor.
            cancel_campaign(&mut campaign, ctx);
            
            test_scenario::return_shared(campaign);
        }
        
        test_scenario::end(test_scenario_instance);
    }
}
