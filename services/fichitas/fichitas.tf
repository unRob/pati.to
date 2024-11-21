terraform {
  backend "consul" {
    path = "nidito/state/service/fichitas.pati.to"
  }

  required_providers {
    consul = {
      source  = "hashicorp/consul"
      version = "~> 2.21.0"
    }
    vault = {
      source  = "hashicorp/vault"
      version = "~> 4.4.0"
    }
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.29.0"
    }
  }

  required_version = ">= 1.0.0"
}

data "vault_generic_secret" "DO" {
  path = "cfg/infra/tree/provider:digitalocean"
}

provider "digitalocean" {
  token = data.vault_generic_secret.DO.data.patito
}

data "terraform_remote_state" "rob_mx" {
  backend = "consul"
  workspace = "default"
  config = {
    datacenter = "casa"
    path = "nidito/state/rob.mx"
  }
}

resource "digitalocean_record" "service" {
  domain = "pati.to"
  type   = "A"
  ttl    = 3600
  name   = "fichitas"
  value  = data.terraform_remote_state.rob_mx.outputs.bernal.ip
}

resource "consul_keys" "cdn-config" {
  datacenter = "qro0"
  key {
    path = "cdn/fichitas.pati.to"
    value = jsonencode({
      cert         = "pati.to"
      folder       = "fichitas.pati.to"
      nginx_config = file("${abspath(path.root)}/nginx.conf")
    })
  }
}

resource "vault_kv_secret" "deploy-config" {
  path = "nidito/deploy/fichitas.pati.to"
  data_json = jsonencode({
    type   = "ssh"
    host   = "bernal"
    domain = "fichitas.pati.to"
  })
}

