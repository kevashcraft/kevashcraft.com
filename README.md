# KevAshcraft.com

Kevin Ashcraft's website featuring a home page and potential blog.

## Getting Started

This site uses [twig](https://twig.sensiolabs.org) templates that are built with [gulp](http://gulpjs.com) and is separated into folders for the different subdomains, www and blog.

### Dependencies

To get started, install the node dependencies with npm (`npm update` should do it) and ensure that gulp is globally installed (`npm i -g gulp`).

### Building

In the base directory run `gulp` to build the dist directory for each folder.

## Deployment

The recommended server is [CentOS](https://www.centos.org/) running [Apache's httpd](https://httpd.apache.org/) with mod_ssl and certificates generated with [Let's Encrypt](https://letsencrypt.org/).

### Installation

`yum install httpd mod_ssl epel-release`

`yum install letsencrypt`

### Certificates

`letsencrypt certonly --standalone -d kevashcraft.com -d www.kevashcraft.com -d blog.kevashcraft.com`

### VirtualHost

```
<VirtualHost *:80>
  ServerName kevashcraft.com
  ServerAlias www.kevashcraft.com

  RewriteEngine on
  RewriteRule (.*) https://www.kevashcraft.com$1 [R,L]
</VirtualHost>

<VirtualHost *:443>
  ServerName kevashcraft.com

  RewriteEngine on
  RewriteRule (.*) https://www.kevashcraft.com$1 [R,L]

  SSLEngine on
  SSLCertificateFile      /etc/letsencrypt/live/kevashcraft.com/cert.pem
  SSLCertificateChainFile /etc/letsencrypt/live/kevashcraft.com/chain.pem
  SSLCertificateKeyFile   /etc/letsencrypt/live/kevashcraft.com/privkey.pem
  SSLCACertificateFile    /etc/letsencrypt/live/kevashcraft.com/fullchain.pem
  # HSTS (mod_headers is required) (15768000 seconds = 6 months)
  Header always set Strict-Transport-Security "max-age=15768000"
</VirtualHost>

<VirtualHost *:443>
  ServerName www.kevashcraft.com
  DocumentRoot /srv/kevashcraft.com/www/dist

  <IfModule mod_deflate.c>
    <IfModule mod_filter.c>
      # these are known to be safe with MSIE 6
      AddOutputFilterByType DEFLATE text/html text/plain text/xml

      # everything else may cause problems with MSIE 6
      AddOutputFilterByType DEFLATE text/css
      AddOutputFilterByType DEFLATE application/x-javascript application/javascript application/ecmascript
      AddOutputFilterByType DEFLATE application/rss+xml
      AddOutputFilterByType DEFLATE application/xml
    </IfModule>
  </IfModule>

  <FilesMatch "\.(ico|pdf|flv|jpg|jpeg|png|gif|js|css|swf)$">
    Header set Cache-Control "max-age=604800, public"
  </FilesMatch>

  SSLEngine on
  SSLCertificateFile      /etc/letsencrypt/live/kevashcraft.com/cert.pem
  SSLCertificateChainFile /etc/letsencrypt/live/kevashcraft.com/chain.pem
  SSLCertificateKeyFile   /etc/letsencrypt/live/kevashcraft.com/privkey.pem
  SSLCACertificateFile    /etc/letsencrypt/live/kevashcraft.com/fullchain.pem
  # HSTS (mod_headers is required) (15768000 seconds = 6 months)
  Header always set Strict-Transport-Security "max-age=15768000"
</VirtualHost>

<VirtualHost *:443>
  ServerName blog.kevashcraft.com
  DocumentRoot /srv/kevashcraft.com/blog/dist

  <IfModule mod_deflate.c>
    <IfModule mod_filter.c>
      # these are known to be safe with MSIE 6
      AddOutputFilterByType DEFLATE text/html text/plain text/xml

      # everything else may cause problems with MSIE 6
      AddOutputFilterByType DEFLATE text/css
      AddOutputFilterByType DEFLATE application/x-javascript application/javascript application/ecmascript
      AddOutputFilterByType DEFLATE application/rss+xml
      AddOutputFilterByType DEFLATE application/xml
    </IfModule>
  </IfModule>

  <FilesMatch "\.(ico|pdf|flv|jpg|jpeg|png|gif|js|css|swf)$">
    Header set Cache-Control "max-age=604800, public"
  </FilesMatch>

  SSLEngine on
  SSLCertificateFile      /etc/letsencrypt/live/kevashcraft.com/cert.pem
  SSLCertificateChainFile /etc/letsencrypt/live/kevashcraft.com/chain.pem
  SSLCertificateKeyFile   /etc/letsencrypt/live/kevashcraft.com/privkey.pem
  SSLCACertificateFile    /etc/letsencrypt/live/kevashcraft.com/fullchain.pem
  # HSTS (mod_headers is required) (15768000 seconds = 6 months)
  Header always set Strict-Transport-Security "max-age=15768000"
</VirtualHost>
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
