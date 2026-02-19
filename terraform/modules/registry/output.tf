output "repo_id" {
  # This must match the name used in modules/registry/main.tf
  value = google_artifact_registry_repository.repo.id 
}