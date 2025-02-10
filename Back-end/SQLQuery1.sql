--Edit Database 1.2
--Bug thì alo Thu Hà

--Edit table Marketing
ALTER TABLE MarketingCampaign ADD MarketingCampaignId_New VARCHAR(100);

UPDATE MarketingCampaign 
SET MarketingCampaignId_New = CAST(MarketingCampaignId AS VARCHAR(100));

ALTER TABLE Payment DROP CONSTRAINT FK__Payment__Marketi__5441852A; -- Thay bằng tên thật của FK

ALTER TABLE MarketingCampaign DROP CONSTRAINT PK__Marketin__A36E430B0BFCD9DA; -- Thay bằng tên thật của PK

ALTER TABLE MarketingCampaign DROP COLUMN MarketingCampaignId;

EXEC sp_rename 'MarketingCampaign.MarketingCampaignId_New', 'MarketingCampaignId', 'COLUMN';

ALTER TABLE MarketingCampaign 
ALTER COLUMN MarketingCampaignId VARCHAR(100) NOT NULL;



ALTER TABLE Payment DROP CONSTRAINT FK__Payment__booking__534D60F1;

ALTER TABLE Payment 
ALTER COLUMN MarketingCampaignId VARCHAR(100);



ALTER TABLE Payment 
ADD CONSTRAINT FK_Payment_MarketingCampaign FOREIGN KEY (MarketingCampaignId) 
REFERENCES MarketingCampaign(MarketingCampaignId);


--Convert TypeData from money to int in Vaccine table
ALTER TABLE Vaccine ADD price_temp INT;
UPDATE Vaccine
SET price_temp = CAST(price AS int);
ALTER TABLE Vaccine DROP COLUMN price;
EXEC sp_rename 'Vaccine.price_temp', 'price', 'COLUMN';


--Edit Relationship between payment and booking detail
ALTER TABLE Payment
ADD CONSTRAINT fk_payment_booking
FOREIGN KEY (bookingId)
REFERENCES Booking(bookingId)
ON DELETE CASCADE;

ALTER TABLE Payment
ADD CONSTRAINT unique_booking_payment UNIQUE (bookingId);