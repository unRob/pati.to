terraform {
  backend "consul" {
    path = "nidito/state/service/club-patito"
  }

  required_providers {
    acme = {
      source  = "vancluever/acme"
      version = "~> 2.5.3"
    }

    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.16.0"
    }

    vault = {
      source  = "hashicorp/vault"
      version = "~> 3.7.0"
    }
  }

  required_version = ">= 1.0.0"
}

locals {
  policies = {
    "sys/capabilities-self" = ["update"]
    "auth/token/renew-self" = ["update"]
    "config/kv/provider:cdn" = ["read"]
    "config/kv/pati.to:club" = ["read"]
    "cfg/infra/tree/provider:cdn" = ["read"]
    "cfg/svc/tree/pati.to:club" = ["read"]
  }

  mx_servers = {
    "mxa.mailgun.org." = 10,
    "mxb.mailgun.org." = 10,
  }
}

provider "acme" {
  server_url = "https://acme-v02.api.letsencrypt.org/directory"
}

// DO tokens for compute resources
data "vault_generic_secret" "DO" {
  path = "cfg/infra/tree/provider:digitalocean"
}

provider "digitalocean" {
  token = data.vault_generic_secret.DO.data.patito
}

provider "digitalocean" {
  alias = "compute"
  token = data.vault_generic_secret.DO.data.token
}

data "digitalocean_droplet" "bedstuy" {
  provider = digitalocean.compute
  name = "bedstuy"
}

resource "vault_policy" "service" {
  name = "club-patito"
  policy = <<-HCL
  %{ for path in sort(keys(local.policies)) }path "${path}" {
    capabilities = ${jsonencode(local.policies[path])}
  }

  %{ endfor }
  HCL
}

resource "digitalocean_record" "to_pati_club" {
  domain = "pati.to"
  type   = "A"
  ttl    = 3600
  name   = "club"
  value  = data.digitalocean_droplet.bedstuy.ipv4_address
}

resource "digitalocean_record" "txt_smtp_domainkey" {
  domain = "pati.to"
  type   = "TXT"
  name   = "mailo._domainkey.mail.club"
  value  = "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDG2sUJLqDOqMnjMy3+fNI0rdrGb8VrI84yloaXE9R8aLEXkm0jlANiFEmVF7s7ZvoDoKm0v5Lm/JsvM/Rl8n9TS2QYMqhmVsEmuBHwOVhekUDW/LKvfDxfNhmbquvU4z+/fn2WBx19dLG3Ctao7pbL7B9TKR+sPJUNoFWRseucMQIDAQAB"
}

resource "digitalocean_record" "txt_spf" {
  domain = "pati.to"
  type   = "TXT"
  name   = "mail.club"
  value  = "v=spf1 include:mailgun.org ~all;"
}

resource "digitalocean_record" "mx" {
  for_each = local.mx_servers
  domain   = "pati.to"
  type     = "MX"
  name     = "mail.club"
  value    = each.key
  priority = each.value
}


data "terraform_remote_state" "registration" {
  backend = "consul"
  workspace = "default"
  config = {
    address = "consul.service.casa.consul:5554"
    scheme = "https"
    path = "nidito/state/letsencrypt/registration"
  }
}

resource acme_certificate cert {
  account_key_pem           = data.terraform_remote_state.registration.outputs.account_key
  common_name               = "pati.to"
  subject_alternative_names = ["*.pati.to"]
  recursive_nameservers = ["1.1.1.1:53", "8.8.8.8:53"]

  dns_challenge {
    provider = "digitalocean"
    config = {
      DO_AUTH_TOKEN = data.vault_generic_secret.DO.data.patito
      DO_PROPAGATION_TIMEOUT = 60
      DO_TTL = 30
    }
  }
}

resource vault_generic_secret cert {
  path = "nidito/tls/${acme_certificate.cert.common_name}"
  data_json = jsonencode({
    private_key = acme_certificate.cert.private_key_pem,
    cert = join("", [
      acme_certificate.cert.certificate_pem,
      acme_certificate.cert.issuer_pem,
    ])
    issuer = acme_certificate.cert.issuer_pem,
    bare_cert = acme_certificate.cert.certificate_pem,
  })
}
