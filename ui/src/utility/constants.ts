// src/constants.ts
export const PACKAGE_ID =
  "0xb1ad72c535ecd56ba03b6708d567c2c586f9ebe173da0bdca35040a2cee54b03";
export const MODULE_NAME = "fundraiser";
// 1 SUI = 1 Milyar MIST. Hesaplamalarda bunu kullanacağız.
export const MIST_PER_SUI = 1_000_000_000;

export const EVENT_DONATION_RECEIVED = `${PACKAGE_ID}::${MODULE_NAME}::DonationReceived`;
