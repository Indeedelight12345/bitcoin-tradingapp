output "cluster_name" {
  # This must match the name in modules/compute/main.tf 
  # Usually: resource "google_container_cluster" "primary"
  value = google_container_cluster.primary.name
}

output "kubernetes_endpoint" {
  value = google_container_cluster.primary.endpoint
}