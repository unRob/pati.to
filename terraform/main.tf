terraform {
  backend "consul" {
    path = "nidito/state/pati.to"
  }

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.43.0"
    }
    vault = {
      source  = "hashicorp/vault"
      version = "~> 4.4.0"
    }
  }

  required_version = ">= 1.0.0"
}

data "vault_generic_secret" "do_token" {
  path = "cfg/infra/tree/provider:digitalocean"
}

provider "digitalocean" {
  token = data.vault_generic_secret.do_token.data.patito
}
