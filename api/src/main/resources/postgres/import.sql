-- EcoDeli MVP V1 - PostgreSQL
-- Seed data : le schéma est géré via Hibernate ORM.

INSERT INTO app_user (id, keycloak_user_id, email, phone, status, created_at, updated_at)
VALUES (10001, 'kc-admin-001', 'admin@ecodeli.local', NULL, 'ACTIVE', now(), now()),
       (10002, 'kc-client-001', 'client@ecodeli.local', '0600000002', 'ACTIVE', now(), now()),
       (10003, 'kc-courier-001', 'livreur@ecodeli.local', '0600000003', 'ACTIVE', now(), now()),
       (10004, 'kc-merchant-001', 'merchant@ecodeli.local', '0600000004', 'ACTIVE', now(), now()),
       (10005, 'kc-provider-001', 'provider@ecodeli.local', '0600000005', 'ACTIVE', now(), now()),
       (10006, 'kc-provider-002', 'provider2@ecodeli.local', '0600000006', 'ACTIVE', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_profile (user_id, first_name, last_name, birth_date, default_language, tutorial_shown_at, tutorial_completed_at)
VALUES (10001, 'Ada', 'Admin', '1990-01-01', 'fr', now(), now()),
       (10002, 'Clara', 'Client', '1998-05-12', 'fr', now(), now()),
       (10003, 'Liam', 'Livreur', '1995-09-20', 'fr', now(), NULL),
       (10004, 'Max', 'Marchand', '1988-03-03', 'fr', now(), now()),
       (10005, 'Eva', 'Provider', '1992-07-15', 'fr', now(), now()),
       (10006, 'Noor', 'Provider', '1990-11-02', 'fr', now(), NULL)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO address (id, label, line1, line2, postal_code, city, country_code, latitude, longitude)
VALUES (101, 'Départ', '10 Rue de Paris', NULL, '75001', 'Paris', 'FR', 48.8566000, 2.3522000),
       (102, 'Arrivée', '20 Rue de Marseille', NULL, '13001', 'Marseille', 'FR', 43.2965000, 5.3698000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_address (user_id, address_id, is_default)
VALUES (10002, 101, true)
ON CONFLICT (user_id, address_id) DO NOTHING;

INSERT INTO user_device (id, user_id, onesignal_player_id, platform, created_at, last_active_at)
VALUES (1001, 10002, 'onesignal-player-client-001', 'web', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO document (id, storage_key, file_name, mime_type, size_bytes, sha256, type, created_at)
VALUES (201, 'courier/id_livreur_001.pdf', 'id_livreur_001.pdf', 'application/pdf', 12345, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'COURIER_PROOF', now()),
       (202, 'contracts/merchant_contract_001.pdf', 'merchant_contract_001.pdf', 'application/pdf', 23456, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'CONTRACT', now()),
       (203, 'invoices/inv_2025_0001.pdf', 'inv_2025_0001.pdf', 'application/pdf', 34567, 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc', 'INVOICE', now()),
       (204, 'providers/id_provider_001.pdf', 'id_provider_001.pdf', 'application/pdf', 45678, 'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', 'PROVIDER_PROOF', now()),
       (205, 'providers/certif_provider_001.pdf', 'certif_provider_001.pdf', 'application/pdf', 56789, 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', 'PROVIDER_PROOF', now()),
       (206, 'providers/id_provider_002.pdf', 'id_provider_002.pdf', 'application/pdf', 27890, 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'PROVIDER_PROOF', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO document_access (document_id, user_id, can_read)
VALUES (201, 10003, true),
       (202, 10004, true),
       (203, 10002, true),
       (204, 10005, true),
       (205, 10005, true),
       (206, 10006, true)
ON CONFLICT (document_id, user_id) DO NOTHING;

INSERT INTO courier_profile (user_id, status, validated_at, vehicle_type, max_weight_kg, iban_masked)
VALUES (10003, 'APPROVED', now(), 'CAR', 50.0,
        'FR76 **** **** **** **** **** 123')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO provider_profile (user_id, status, validated_at, validated_by_admin_id, bio, skills, hourly_rate_cents, currency, iban_masked, rejection_reason, created_at, updated_at)
VALUES (10005, 'APPROVED', now() - interval '2 days', 10001,
        'Prestataire expérimentée pour services à domicile',
        'ménage,garde-enfant,repassage',
        3000, 'EUR', 'FR76 **** **** **** **** **** 987', NULL, now(), now()),
       (10006, 'PENDING', NULL, NULL,
        'En cours d''inscription – besoins en validations',
        'ménage',
        2500, 'EUR', 'FR76 **** **** **** **** **** 654', NULL, now(), now())
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO courier_document (id, courier_user_id, type, document_id, status, reviewed_at, reviewed_by_admin_id)
VALUES (301, 10003, 'ID', 201, 'APPROVED', now(), 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO provider_attachment (id, provider_user_id, document_id, type, status, submitted_at, reviewed_at, reviewed_by_admin_id, rejection_reason)
VALUES (401, 10005, 204, 'ID', 'APPROVED', now() - interval '5 days', now() - interval '4 days', 10001, NULL),
       (402, 10005, 205, 'CERTIFICATE', 'PENDING', now() - interval '1 days', NULL, NULL, NULL),
       (403, 10006, 206, 'ID', 'REJECTED', now() - interval '3 days', now() - interval '2 days', 10001, 'Invalid document')
ON CONFLICT (id) DO NOTHING;

INSERT INTO merchant_company (id, merchant_user_id, name, siret, vat_number, billing_email, created_at)
VALUES (401, 10004, 'Marchand Demo', '12345678901234', 'FR123456789', 'billing@merchant.local', now()),
       (402, 10005, 'Provider SARL', '56789012345678', 'FR987654321', 'facturation@providersarl.local', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO merchant_contract (id, merchant_company_id, status, start_date, end_date, terms_pdf_document_id, created_at, signed_at, signed_by_user_id, countersigned_at, countersigned_by_admin_id)
VALUES (501, 401, 'APPROVED', '2025-01-01', NULL, 202, now(), now(), 10004, now(), 10001),
       (502, 402, 'PENDING_SIGNATURE', NULL, NULL, 205, now(), NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO announcement (id, created_by_user_id, merchant_company_id, type, status, title, description, from_address_id, to_address_id, earliest_at, latest_at, budget_cents, currency, created_at, updated_at)
VALUES (501, 10002, NULL, 'PARCEL_TRANSPORT', 'PUBLISHED', 'Colis Paris -> Marseille', 'Transport d’un petit colis', 101, 102, now(), now() + interval '2 days', 3500, 'EUR', now(), now()),
       (502, 10004, 401, 'PARCEL_TRANSPORT', 'DRAFT', 'Livraison Lyon -> Lille', 'Palette fragile à livrer', 101, 102, now() + interval '3 days', now() + interval '4 days', 5200, 'EUR', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO announcement_assignment (announcement_id, courier_user_id, assigned_at, note)
VALUES (501, 10003, now(), 'Pris en charge')
ON CONFLICT (announcement_id, courier_user_id) DO NOTHING;

INSERT INTO parcel (id, owner_user_id, weight_kg, length_cm, width_cm, height_cm, declared_value_cents, currency, special_instructions)
VALUES (601, 10002, 2.500, 30.00, 20.00, 10.00, 5000, 'EUR', 'Fragile')
ON CONFLICT (id) DO NOTHING;

INSERT INTO delivery (id, announcement_id, parcel_id, shipper_user_id, courier_user_id, recipient_name, pickup_address_id, dropoff_address_id, status, price_cents, currency, created_at, updated_at)
VALUES (602, 501, 601, 10002, 10003, 'Jean Dupont', 101, 102, 'ASSIGNED', 3500, 'EUR', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO tracking_event (id, delivery_id, occurred_at, status, latitude, longitude, message)
VALUES (603, 602, now(), 'INFO', 48.8566000, 2.3522000, 'Livraison acceptée'),
       (604, 602, now() + interval '1 hour', 'PICKED_UP', 48.8570000, 2.3530000, 'Colis récupéré')
ON CONFLICT (id) DO NOTHING;

INSERT INTO payment (id, payer_user_id, stripe_payment_intent_id, amount_cents, currency, status, description, created_at, updated_at)
VALUES (701, 10002, 'pi_demo_0001', 3500, 'EUR', 'SUCCEEDED', 'Paiement seed livraison', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO billable_link (id, payment_id, delivery_id, type, label)
VALUES (702, 701, 602, 'DELIVERY', 'Livraison 602')
ON CONFLICT (id) DO NOTHING;

INSERT INTO invoice (id, invoice_no, user_id, payment_id, status, period_start, period_end, total_cents, currency, pdf_document_id, issued_at)
VALUES (801, 'INV-2025-0001', 10002, 701, 'ISSUED', date_trunc('month', now())::date, (date_trunc('month', now()) + interval '1 month - 1 day')::date, 3500, 'EUR', 203, now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO invoice_line (id, invoice_id, label, quantity, unit_price_cents, total_cents)
VALUES (802, 801, 'Livraison Paris -> Marseille', 1, 3500, 3500)
ON CONFLICT (id) DO NOTHING;

INSERT INTO payout (id, beneficiary_user_id, status, period_start, period_end, amount_cents, currency, reference, sent_at)
VALUES (901, 10003, 'PENDING', date_trunc('month', now())::date, (date_trunc('month', now()) + interval '1 month - 1 day')::date, 2500, 'EUR', 'PAYOUT-2025-0001', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO notification (id, user_id, title, body, data_json, sent_at, read_at)
VALUES (1001, 2, 'Commande prise en charge', 'Votre annonce a été prise en charge par un livreur.', '{"announcementId":501}', now(), NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO payout_line (id, payout_id, delivery_id, amount_cents, currency, note, recorded_at)
VALUES (902, 901, 602, 2500, 'EUR', 'Livraison Paris -> Marseille', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO provider_availability (id, provider_user_id, day_of_week, date, start_time, end_time, timezone, is_recurring)
VALUES (501, 10005, 'MONDAY', NULL, '08:00', '12:00', 'Europe/Paris', true),
       (502, 10005, 'WEDNESDAY', NULL, '14:00', '18:00', 'Europe/Paris', true),
       (503, 10005, NULL, current_date + interval '3 days', '09:00', '11:00', 'Europe/Paris', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO provider_assignment (id, provider_user_id, title, description, status, scheduled_at, completed_at, client_name, client_contact)
VALUES (601, 10005, 'Aide ménagère - Centre Paris', 'Nettoyage hebdomadaire d''un appartement 70m²', 'IN_PROGRESS', now() + interval '1 day', NULL, 'Mme Martin', 'martin@example.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO provider_invoice (id, provider_user_id, period_start, period_end, total_cents, currency, status, document_id, issued_at)
VALUES (701, 10005, date_trunc('month', now())::timestamp,
        (date_trunc('month', now()) + interval '1 month - 1 day')::timestamp,
        42000, 'EUR', 'ISSUED', 203, now())
ON CONFLICT (id) DO NOTHING;
