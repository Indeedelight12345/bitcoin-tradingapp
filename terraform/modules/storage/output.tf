output "velero_bucket_name" {
  # This must match the name in modules/storage/main.tf
  # Example: resource "google_storage_bucket" "velero"
  value = google_storage_bucket.velero.name
}

output "velero_sa_email" {
  value = google_service_account.velero_sa.email
}