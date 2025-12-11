# EcoDeli — API REST V1 (Endpoints)

Base path : `/api/v1`  
Auth : `Authorization: Bearer <JWT>` (Keycloak)  
Rôles (Keycloak) : `CLIENT`, `COURIER`, `MERCHANT`, `ADMIN`, `PROVIDER`

Conventions :
- Filtrage via query params documentés (`status`, `type`, `mine`, `merchantCompanyId`, `page`, `size`, `sort`). Chaque paramètre doit être déclaré avec type et valeurs autorisées dans l’OpenAPI.
- Pagination : `page` (0-based) et `size` (<= 100) retournent systématiquement `totalElements`, `totalPages`, `page`, `size` dans les réponses liste.
- IDs : BIGINT (64 bits). Les payloads exposent `id` sous forme numérique pour rester cohérents avec Panache.
- Ressources au pluriel, actions non-CRUD via sous-ressources (`/publish`, `/cancel`, `/assignments`).
- Erreurs : format JSON unique `{ "code": "string", "message": "string", "details": {...} }` avec RFC 7807 optionnel pour les cas métier.
- OpenAPI 3.1 : la définition contractuelle est maintenue dans `openapi/ecodeli-api.yaml` (générée par SmallRye). Ce fichier fait foi pour les schémas, paramètres et rôles.

---

## 1) Auth / Identité

### Me
- `GET /api/v1/users/me` *(roles: authentifié)*  
  Retourne les infos utilisateur (et éventuellement les métadonnées utiles : rôles, profils existants).
  - Réponse : `AppUserSummary`
  - Erreurs : `401` si token invalide.

---

## 2) Users (profil, adresses, devices)

### Profil
- `GET /api/v1/users/me/profile` *(roles: CLIENT|COURIER|MERCHANT|PROVIDER)*
- `PATCH /api/v1/users/me/profile` *(roles: identiques, payload `UserProfileUpdate`)*

### Adresses
- `GET /api/v1/users/me/addresses` *(roles: CLIENT|MERCHANT|PROVIDER)*, réponse paginée `UserAddressList`.
- `POST /api/v1/users/me/addresses` *(payload `AddressCreate`)*
- `PATCH /api/v1/users/me/addresses/{addressId}` *(payload `AddressUpdate`)*
- `PUT /api/v1/users/me/addresses/{addressId}/default`
- `DELETE /api/v1/users/me/addresses/{addressId}`

### Devices (push)
- `POST /api/v1/users/me/devices` *(payload `UserDeviceCreate`)*
- `DELETE /api/v1/users/me/devices/{deviceId}`

---

## 3) Documents (upload + download sécurisé)

- `POST /api/v1/documents` *(multipart, roles: authentifié)*
- `GET /api/v1/documents/{documentId}`
- `GET /api/v1/documents/{documentId}/download`

---

## 4) Couriers (profil + justificatifs)

### Profil livreur
- `GET /api/v1/couriers/me/profile` *(roles: COURIER)*
- `PATCH /api/v1/couriers/me/profile`

### Justificatifs
- `GET /api/v1/couriers/me/documents`
- `POST /api/v1/couriers/me/documents`

---

## 5) Providers (services à la personne)

### Profil & validation
- `GET /api/v1/providers/me/profile` *(roles: PROVIDER, réponse `ProviderProfile`)*
- `PATCH /api/v1/providers/me/profile` *(payload `ProviderProfileUpdate`, réponse `ProviderProfile`)*
- `GET /api/v1/providers/me/attachments` *(liste `ProviderAttachment`)*
- `POST /api/v1/providers/me/attachments` *(upload multipart `ProviderAttachmentUploadForm`, réponse `ProviderAttachment`)*

### Disponibilités & missions
- `GET /api/v1/providers/me/availability` *(liste `ProviderAvailabilitySlot`)*
- `PUT /api/v1/providers/me/availability` *(payload `ProviderAvailabilityUpdate`, réponse `ProviderAvailabilitySlot[]`)*
- `GET /api/v1/providers/me/assignments` *(liste `ProviderAssignment`)*
- `PATCH /api/v1/providers/me/assignments/{assignmentId}` *(payload `ProviderAssignmentStatusUpdate`, réponse `ProviderAssignment`)*

### Facturation prestataire
- `GET /api/v1/providers/me/invoices` *(liste `ProviderInvoice`)*
- `GET /api/v1/providers/me/invoices/{invoiceId}` *(réponse `ProviderInvoice`)*

---

## 6) Merchants (entreprise + contrats)

### Entreprise
- `GET /api/v1/merchants/me/company` *(roles: MERCHANT)*
- `PATCH /api/v1/merchants/me/company` *(payload `MerchantCompanyUpdate`)*

### Contrats
- `GET /api/v1/merchants/me/contracts` *(liste `MerchantContract`)*
- `GET /api/v1/merchants/me/contracts/{contractId}` *(ownership obligatoire)*
- `POST /api/v1/merchants/me/contracts` *(payload `MerchantContractDraft`, crée un contrat en statut `PENDING_SIGNATURE`)*
- `POST /api/v1/merchants/me/contracts/{contractId}/sign` *(payload `MerchantContractSign`, passe en `AWAITING_COUNTERSIGN`)*

### Admin
- `POST /api/v1/admin/merchant-contracts/{contractId}/approve` *(contre-signature -> `APPROVED`)*

---

## 7) Marketplace — Announcements

### CRUD annonces
- `GET /api/v1/announcements?status=&type=&mine=` *(authentifié, `mine=true` pour restreindre)*
- `POST /api/v1/announcements` *(roles: CLIENT|MERCHANT, payload `AnnouncementCreateDto`)*
- `PATCH /api/v1/announcements/{id}` *(roles: CLIENT|MERCHANT, payload `AnnouncementUpdateDto`, seulement statut `DRAFT`)*
- `POST /api/v1/announcements/{id}/publish`
- `POST /api/v1/announcements/{id}/cancel`

### Assignation courier
- `GET /api/v1/announcements/{id}/assignments`
- `POST /api/v1/announcements/{id}/assignments` *(roles: COURIER, payload `AnnouncementAssignmentRequestDto`, nécessite `CourierProfile.status = APPROVED`)*

---

## 8) Parcels (optionnel V1)

- `POST /api/v1/parcels` *(roles: CLIENT|MERCHANT)*
- `GET /api/v1/parcels/{parcelId}`

---

## 9) Deliveries

### Consultation
- `GET /api/v1/deliveries` *(filtres `mine`, `assignedToMe`, `announcementId`)*
- `GET /api/v1/deliveries/{deliveryId}`

### Création
- `POST /api/v1/deliveries` *(roles: ADMIN)*

### Changement de statut
- `PATCH /api/v1/deliveries/{deliveryId}/status` *(payload `DeliveryStatusUpdate`)

---

## 10) Tracking

- `GET /api/v1/deliveries/{deliveryId}/tracking-events`
- `POST /api/v1/deliveries/{deliveryId}/tracking-events` *(optionnel, roles: COURIER)*

---

## 11) Payments (Stripe)

### Créer un paiement
- `POST /api/v1/payments/intents` *(payload `PaymentIntentRequest`)*

### Lire un paiement
- `GET /api/v1/payments/{paymentId}`
- `GET /api/v1/deliveries/{deliveryId}/payment`

### Webhook Stripe
- `POST /api/webhooks/stripe`

---

## 12) Invoices (factures PDF)

- `GET /api/v1/invoices?mine=true`
- `GET /api/v1/invoices/{invoiceId}`
- `GET /api/v1/invoices/{invoiceId}/download`

---

## 13) Payouts (virements)

### Côté courier
- `GET /api/v1/payouts?mine=true`

### Admin/Compta
- `GET /api/v1/admin/payouts`
- `POST /api/v1/admin/payouts/generate?period=YYYY-MM`

---

## 14) Notifications

- `GET /api/v1/notifications?mine=true`
- `PATCH /api/v1/notifications/{notificationId}`
- `POST /api/v1/notifications/{notificationId}/read`

---

## 15) Admin

### Couriers + validation documents
- `GET /api/v1/admin/couriers`
- `GET /api/v1/admin/couriers/{courierUserId}`
- `PATCH /api/v1/admin/couriers/{courierUserId}/status`
- `GET /api/v1/admin/courier-documents?courierUserId=...`
- `PATCH /api/v1/admin/courier-documents/{courierDocumentId}`

### Contrats marchands
- `GET /api/v1/admin/merchant-contracts`
- `POST /api/v1/admin/merchant-contracts/{contractId}/approve` *(contre-signature / activation)*

### Vues globales
- `GET /api/v1/admin/announcements`
- `GET /api/v1/admin/deliveries`
- `GET /api/v1/admin/payments`
- `GET /api/v1/admin/invoices`

### Providers — Admin
- `GET /api/v1/admin/providers?status=&pendingOnly=` *(liste `ProviderProfileAdmin`)*
- `PATCH /api/v1/admin/providers/{providerUserId}/status` *(payload `ProviderProfileReview`, approuve/rejette le profil)*
- `GET /api/v1/admin/providers/attachments?status=&pendingOnly=` *(liste `ProviderAttachmentAdmin`)*
- `PATCH /api/v1/admin/providers/attachments/{attachmentId}` *(payload `ProviderAttachmentReview`)*
- `GET /api/v1/admin/providers/attachments/{attachmentId}/download`
