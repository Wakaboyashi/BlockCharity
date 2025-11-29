# 💙 BlockCharity - Trusted Donation Platform on Sui

**BlockCharity** is a decentralized fundraising platform built on the **Sui
Blockchain**. It solves the "trust issue" in traditional charity by using smart
contracts to ensure funds are either used for their intended purpose or refunded
to the donors.

**"Don't trust the institution. Trust the code."**

---

## 🚀 The Problem

In traditional donation systems:

- **Lack of Transparency:** Donors don't know if their money actually reached
  the needy.
- **Centralized Risk:** Funds are held in private bank accounts, prone to misuse
  or freezing.
- **Refund Difficulty:** If a campaign fails or is cancelled, getting a refund
  is bureaucratic and slow.

## 💡 The Solution: BlockCharity

We utilize **Sui Move Smart Contracts** to act as a programmable escrow vault.

1.  **Locked Funds:** Donations are locked in a `Campaign Object` on-chain.
2.  **Verified Recipients:** Funds can _only_ be withdrawn to the pre-defined
    beneficiary address (e.g., a hospital wallet).
3.  **Trusted Refunds:** If a campaign is cancelled, the contract guarantees
    that donors can reclaim their funds.
4.  **Atomic Batch Refunds:** Utilizing **Sui PTBs (Programmable Transaction
    Blocks)**, admins can cancel a campaign and auto-refund multiple donors in a
    single transaction.

---

## ✨ Key Features

- **🛡️ On-Chain Transparency:** Every donation, withdrawal, and status change is
  recorded on the Sui network.
- **💸 Smart Refunds:** \* _Pull:_ Donors can manually claim their funds if a
  campaign is cancelled.
  - _Push:_ Admins can trigger automatic batch refunds using PTBs.
- **🏥 Verified Beneficiaries:** Campaign targets (wallet addresses) are
  hardcoded into the object, preventing funds from being diverted.
- **⚡ High Speed & Low Cost:** Leveraging Sui's parallel execution for instant
  donations and negligible gas fees.
- **📊 Real-Time Tracking:** The frontend fetches live data (balance, logs)
  directly from the blockchain objects.

---

## 🛠️ Tech Stack

### Blockchain (Backend)

- **Sui Move:** Smart contract logic.
- **Shared Objects:** For managing campaign states.
- **Events:** For indexing donation history.

### Frontend

- **React (Vite):** UI Framework.
- **TypeScript:** Type safety.
- **@mysten/dapp-kit:** Wallet connection and RPC interaction.
- **Tailwind CSS:** Modern styling.
- **Lucide React:** Icons.

---

## 📜 Smart Contract Workflow

1.  **Create Campaign:** Admin creates a `Campaign` shared object with a
    `target` amount and `beneficiary` address.
2.  **Donate:** Users send `SUI` coins. The contract wraps them into the
    campaign's `Balance` and records the donor in a `Table`.
3.  **Withdraw:** Once the goal is met (or manually by admin), funds are
    transferred _only_ to the `beneficiary`.
4.  **Cancel & Refund:** If cancelled, the contract enters `Refund Mode`. The
    `claim_refund` function becomes unlocked for donors.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Sui CLI installed
- Sui Wallet Extension

### 1\. Clone the Repo

```bash
git clone https://github.com/Wakaboyashi/BlockCharity
cd blockcharity
```

### 2\. Smart Contract Deployment

Navigate to the move folder and publish the contract.

```bash
cd move
sui move build
sui client publish --gas-budget 100000000
```

_Note the `Package ID` from the output._

### 3\. Frontend Setup

Update the `src/utility/constants.ts` file with your new **Package ID**.

```typescript
export const PACKAGE_ID = "0x..."; // Your Package ID here
```

Install dependencies and run:

```bash
cd ..
npm install
npm run dev
```

## 👥 The Team

- **Mustafa Ula** - Lead Blockchain Architect
- **Melih Yıldız** - Senior Full Stack Developer
- **Serra Keskin** - Product & Design Lead

---

## 📄 License

This project is licensed under the MIT License.

---

_Built with ❤️ for the Sui Overflow Hackathon._
