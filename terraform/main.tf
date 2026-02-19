# 1. Setup Network (VPC, Subnet, NAT)
module "network" {
  source     = "./modules/network"
  project_id = var.project_id
  region     = var.region
}

# 2. Setup GKE Cluster
module "compute" {
  source     = "./modules/compute"
  project_id = var.project_id
  region     = var.region
  vpc_id  = module.network.vpc_id
  subnet_id  = module.network.subnet_id
  vpc_name = module.network.vpc_name
}

# 3. Setup Artifact Registry
module "registry" {
  source     = "./modules/registry"
  project_id = var.project_id
  region     = var.region
}

# 4. Setup Velero Storage
module "storage" {
  source     = "./modules/storage"
  project_id = var.project_id
  region     = var.region
  velero_bucket_name = "${var.project_id}-velero-backups"
}

# 5. Setup Deployment Runner
module "runner" {
  source     = "./modules/runner"
  region     = var.region
  project_id = var.project_id
  # FIX: Get the VPC name from the network module, not a variable
  vpc_id     = module.network.vpc_name 
  subnet_id  = module.network.subnet_id
}