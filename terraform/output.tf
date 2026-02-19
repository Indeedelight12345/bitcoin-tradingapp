output "gke_cluster_name" {
  value = module.compute.cluster_name
}

output "kubernetes_endpoint" {
  value = module.compute.kubernetes_endpoint
  sensitive = true
}

output "velero_bucket" {
  value = module.storage.velero_bucket_name
}

output "artifact_repository_url" {
  value = module.registry.repo_id
}

