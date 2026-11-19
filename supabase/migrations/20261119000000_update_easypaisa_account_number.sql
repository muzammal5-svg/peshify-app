-- Update Easypaisa payment account number to +92 3323055502 (03323055502)
UPDATE public.payment_accounts
SET account_number = '03323055502'
WHERE method = 'easypaisa';
