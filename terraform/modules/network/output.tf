output "vpc_name" {
  value = google_compute_network.vpc.name
}

output "subnet_id" {
  value = google_compute_subnetwork.subnet.id
}

# Add this so your Compute module (GKE) doesn't complain
output "vpc_id" {
  value = google_compute_network.vpc.id
}