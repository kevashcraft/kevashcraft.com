<?php
# add to visudo
# apache ALL=(kevin) NOPASSWD: /usr/bin/git

shell_exec('cd $(git rev-parse --show-toplevel)');
shell_exec('git pull origin master');
shell_exec('gulp');

