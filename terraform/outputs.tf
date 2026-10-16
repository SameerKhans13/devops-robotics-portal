output "cluster_name" {
  description = "EKS Cluster Name"
  value       = aws_eks_cluster.robotics_cluster.name
}

output "cluster_endpoint" {
  description = "EKS Cluster Control Plane API Endpoint"
  value       = aws_eks_cluster.robotics_cluster.endpoint
}

output "vpc_id" {
  description = "Created VPC ID"
  value       = aws_vpc.robotics_vpc.id
}

output "public_subnets" {
  description = "Public Subnet IDs"
  value       = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
}
