resource "google_storage_bucket" "velero" {
  name          = var.velero_bucket_name
  location      = var.region
  force_destroy = true
  uniform_bucket_level_access = true
}

resource "google_service_account" "velero_sa" {
  account_id   = "velero-admin"
  display_name = "Velero Backup Service Account"
}

resource "google_storage_bucket_iam_member" "velero_access" {
  bucket = google_storage_bucket.velero.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.velero_sa.email}"
}