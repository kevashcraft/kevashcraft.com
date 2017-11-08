<?php
# add to visudo
# apache ALL=(kevin) NOPASSWD: /usr/bin/git
# apache ALL=(kevin) NOPASSWD: /usr/bin/gulp

shell_exec('cd $(git rev-parse --show-toplevel)');
shell_exec('sudo -u kevin git pull origin master');
shell_exec('sudo -u kevin gulp');

