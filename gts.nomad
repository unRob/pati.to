variable "package" {
  type = map(object({
    image   = string
    version = string
  }))
  default = {}
}

job "club-patito" {
  datacenters = ["qro0"]
  region = "qro0"
  namespace = "social"


  group "club-patito" {
    reschedule {
      delay          = "5s"
      delay_function = "fibonacci"
      max_delay      = "5m"
      unlimited      = true
    }

    restart {
      attempts = 60
      interval = "10m"
      delay = "10s"
      mode = "delay"
    }

    network {
      mode = "host"
      port "gotosocial" {
        host_network = "private"
      }
    }

    task "db-restore" {
      lifecycle {
        hook = "prestart"
      }

      driver = "docker"
      user = "nobody"

      vault {
        role = "club-patito"
      }

      resources {
        cpu    = 128
        memory = 64
        memory_max = 512
      }

      config {
        image = "${var.package.litestream.image}:${var.package.litestream.version}"
        args = ["restore", "/alloc/gotosocial.db"]
        volumes = ["secrets/litestream.yaml:/etc/litestream.yml"]
      }

      template {
        data = file("litestream.yaml")
        destination = "secrets/litestream.yaml"
      }
    }

    task "db-replicate" {
      lifecycle {
        hook = "prestart"
        sidecar = true
      }

      driver = "docker"
      user = "nobody"

      vault {
        role = "club-patito"
      }

      resources {
        cpu    = 256
        memory = 128
        memory_max = 512
      }

      config {
        image = "${var.package.litestream.image}:${var.package.litestream.version}"
        args = ["replicate"]
        volumes = ["secrets/litestream.yaml:/etc/litestream.yml"]
      }

      template {
        data = file("litestream.yaml")
        destination = "secrets/litestream.yaml"
      }
    }

    task "gotosocial" {
      driver = "docker"
      user = "nobody"

      vault {
        role = "club-patito"
      }

      config {
        image = "${var.package.self.image}:${var.package.self.version}"
        ports = ["gotosocial"]
        args = [
          "--config-path",
          "/secrets/gotosocial.yaml",
          "server",
          "start"
        ]
      }

      template {
        data = file("gotosocial.yaml")
        destination = "secrets/gotosocial.yaml"
      }

      resources {
        cpu    = 256
        memory = 512
        memory_max = 1024
      }

      service {
        name = "gotosocial"
        port = "gotosocial"

        tags = [
          "nidito.service",
          "nidito.dns.enabled",
          "nidito.http.enabled",
          "nidito.http.public",
          "nidito.ingress.enabled",
        ]

        meta {
          nidito-acl = "allow external"
          nidito-http-buffering = "off"
          nidito-http-tls = "pati.to"
          nidito-http-domain = "club.pati.to"
          nidito-http-wss = "on"
          nidito-http-max-body-size = "40m"
        }

        check {
          name     = "gotosocial"
          type     = "tcp"
          interval = "10s"
          timeout  = "2s"
        }
      }
    }
  }
}
