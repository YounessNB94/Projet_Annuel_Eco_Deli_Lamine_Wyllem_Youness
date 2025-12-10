-- EcoDeli MVP V1 - PostgreSQL
-- Seed data : le schéma est géré via Hibernate ORM.

INSERT INTO app_user (id, keycloak_user_id, email, phone, status, created_at, updated_at)
VALUES (10001, 'kc-admin-001', 'admin@ecodeli.local', NULL, 'ACTIVE', now(), now()),
       (10002, 'kc-client-001', 'client@ecodeli.local', '0600000002', 'ACTIVE', now(), now()),
       (10003, 'kc-courier-001', 'livreur@ecodeli.local', '0600000003', 'ACTIVE', now(), now()),
       (10004, 'kc-merchant-001', 'merchant@ecodeli.local', '0600000004', 'ACTIVE', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_profile (user_id, first_name, last_name, birth_date, default_language, tutorial_shown_at, tutorial_completed_at)
VALUES (10001, 'Ada', 'Admin', '1990-01-01', 'fr', now(), now()),
       (10002, 'Clara', 'Client', '1998-05-12', 'fr', now(), now()),
       (10003, 'Liam', 'Livreur', '1995-09-20', 'fr', now(), NULL),
       (10004, 'Max', 'Marchand', '1988-03-03', 'fr', now(), now())
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO address (id, label, line1, line2, postal_code, city, country_code, latitude, longitude)
VALUES (101, 'Départ', '10 Rue de Paris', NULL, '75001', 'Paris', 'FR', 48.8566000, 2.3522000),
       (102, 'Arrivée', '20 Rue de Marseille', NULL, '13001', 'Marseille', 'FR', 43.2965000, 5.3698000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_address (user_id, address_id, is_default)
VALUES (10002, 101, true)
ON CONFLICT (user_id, address_id) DO NOTHING;

INSERT INTO user_device (id, user_id, onesignal_player_id, platform, created_at)
VALUES (1001, 10002, 'onesignal-player-client-001', 'web', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO document (id, storage_key, file_name, mime_type, size_bytes, sha256, type, created_at)
VALUES (201, 'courier/id_livreur_001.pdf', 'id_livreur_001.pdf', 'application/pdf', 12345, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'COURIER_PROOF', now()),
       (202, 'contracts/merchant_contract_001.pdf', 'merchant_contract_001.pdf', 'application/pdf', 23456, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'CONTRACT', now()),
       (203, 'invoices/inv_2025_0001.pdf', 'inv_2025_0001.pdf', 'application/pdf', 34567, 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc', 'INVOICE', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO document_access (document_id, user_id, can_read)
VALUES (201, 10003, true),
       (202, 10004, true),
       (203, 10002, true)
ON CONFLICT (document_id, user_id) DO NOTHING;

INSERT INTO courier_profile (user_id, status, validated_at, vehicle_type, max_weight_kg, iban_masked)
VALUES (10003, 'APPROVED', now(), 'CAR', 50.0,
        'FR76 **** **** **** **** **** 123')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO courier_document (id, courier_user_id, type, document_id, status, reviewed_at, reviewed_by_admin_id)
VALUES (301, 10003, 'ID', 201, 'APPROVED', now(), 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO merchant_company (id, merchant_user_id, name, siret, vat_number, billing_email, created_at)
VALUES (401, 10004, 'Marchand Demo', '12345678901234', 'FR123456789', 'billing@merchant.local', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO merchant_contract (id, merchant_company_id, status, start_date, end_date, terms_pdf_document_id, created_at)
VALUES (402, 401, 'APPROVED', '2025-01-01', NULL, 202, now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO announcement (id, created_by_user_id, merchant_company_id, type, status, title, description, from_address_id, to_address_id, earliest_at, latest_at, budget_cents, currency, created_at)
VALUES (501, 2, NULL, 'PARCEL_TRANSPORT', 'PUBLISHED', 'Colis Paris -> Marseille', 'Transport d’un petit colis', 101, 102, now(), now() + interval '2 days', 3500, 'EUR', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO announcement_assignment (id, announcement_id, assigned_courier_id, assigned_at, note)
VALUES (502, 501, 3, now(), 'Pris en charge')
ON CONFLICT (id) DO NOTHING;

INSERT INTO parcel (id, owner_user_id, weight_kg, length_cm, width_cm, height_cm, declared_value_cents, currency, special_instructions)
VALUES (601, 2, 2.500, 30.00, 20.00, 10.00, 5000, 'EUR', 'Fragile')
ON CONFLICT (id) DO NOTHING;

INSERT INTO delivery (id, announcement_id, parcel_id, shipper_user_id, recipient_name, pickup_address_id, dropoff_address_id, status, price_cents, currency, created_at)
VALUES (602, 501, 601, 2, 'Jean Dupont', 101, 102, 'ACCEPTED', 3500, 'EUR', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO tracking_event (id, delivery_id, occurred_at, status, latitude, longitude, message)
VALUES (603, 602, now(), 'ACCEPTED', 48.8566000, 2.3522000, 'Livraison acceptée'),
       (604, 602, now() + interval '1 hour', 'PICKED_UP', 48.8570000, 2.3530000, 'Colis récupéré')
ON CONFLICT (id) DO NOTHING;

INSERT INTO payment (id, payer_user_id, provider, stripe_payment_intent_id, amount_cents, currency, status, created_at, captured_at)
VALUES (701, 2, 'STRIPE', 'pi_demo_0001', 3500, 'EUR', 'SUCCEEDED', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO billable_link (id, payment_id, delivery_id)
VALUES (702, 701, 602)
ON CONFLICT (id) DO NOTHING;

INSERT INTO invoice (id, invoice_no, entity_type, entity_id, status, period_start, period_end, total_cents, currency, pdf_document_id, issued_at)
VALUES (801, 'INV-2025-0001', 'USER', 2, 'ISSUED', date_trunc('month', now())::date, (date_trunc('month', now()) + interval '1 month - 1 day')::date, 3500, 'EUR', 203, now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO invoice_line (id, invoice_id, label, quantity, unit_price_cents, total_cents)
VALUES (802, 801, 'Livraison Paris -> Marseille', 1, 3500, 3500)
ON CONFLICT (id) DO NOTHING;

INSERT INTO payout (id, beneficiary_user_id, status, period_start, period_end, amount_cents, currency, reference, sent_at)
VALUES (901, 3, 'PENDING', date_trunc('month', now())::date, (date_trunc('month', now()) + interval '1 month - 1 day')::date, 2500, 'EUR', 'PAYOUT-2025-0001', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO notification (id, user_id, title, body, data_json, sent_at, read_at)
VALUES (1001, 2, 'Commande prise en charge', 'Votre annonce a été prise en charge par un livreur.', '{"announcementId":501}', now(), NULL)
ON CONFLICT (id) DO NOTHING;
