terraform {
  backend "gcs" {
    bucket = "terraform_backend_bucket_1112"
    prefix = "terraform/state"
  }
}