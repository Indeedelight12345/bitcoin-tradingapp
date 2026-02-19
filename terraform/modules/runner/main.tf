resource "google_compute_instance" "runner" {
  name         = "deploy-runner"
  machine_type = "e2-small"
  zone         = "${var.region}-a"

  boot_disk {
    initialize_params { image = "debian-cloud/debian-11" }
  }

  network_interface {
    network    = var.vpc_id
    subnetwork = var.subnet_id
    # No public IP; uses Cloud NAT to download tools
  }

  service_account {
    scopes = ["cloud-platform"]
  }
}