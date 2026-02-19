variable "project_id" {
  description = "The GCP Project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
}


variable "subnet_id" {
  description = "The GCP region"
  type        = string
}



variable "vpc_id" {
  type        = string
  description = "The VPC name passed from the network module"
}