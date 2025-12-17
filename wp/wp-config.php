<?php



/** Enable W3 Total Cache */
define('WP_CACHE', true); // Added by W3 Total Cache

define( 'WP_CACHE_KEY_SALT', '37674278e3e57a11df727b3758557fca' );
define( 'WP_REDIS_PASSWORD', 'tLIiQDRpK4g4yq7r' );


// This setting is required to make sure that WordPress updates can be properly managed in WordPress Toolkit. Remove this line if this WordPress website is not managed by WordPress Toolkit anymore.
define('RELOCATE',true);

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings ** //
/** The name of the database for WordPress */
define('DB_NAME', 'znkco_wp_ue9y7');

/** MySQL database username */
define('DB_USER', 'znkco_wp_npmur');

/** MySQL database password */
define('DB_PASSWORD', 'MKg5%cL20!Yg?^~b');

/** MySQL hostname */
define('DB_HOST', 'localhost:3306');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );
define('FORCE_SSL_ADMIN', true);
define('RELOCATE', TRUE);
$_SERVER['HTTPS'] = 'on';




/**
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY', '0z4I9l2b09|)/KO]yZC3z06x+17[T0:enH%88eYLyvvk%F06mEr60:2&h!319OGs');
define('SECURE_AUTH_KEY', '2a0Tp-Lkve*9-/@f1t&lQhm|A;wxVnp998zqmUP(4wM%41r/*U/OjDu_xr3~m!/8');
define('LOGGED_IN_KEY', 'YEY@q/5O%B]Z/X9C9@2vpGx(t1J89]rIZ~[o@a4Cvf1E!]~Kmzq990]!h~u/6#Yh');
define('NONCE_KEY', 'Jj@z9)]zK1w*4B115(-]Sgg_~a3S7TczY[+k]cE~DgHO|/hzsTYSzt7c;(edEB4F');
define('AUTH_SALT', '8EaH(5I_76gn|+0)tD2dR3i!*!f[s*156~#Ikw@23[(YBKY%b@[%f%iM7Kt14p14');
define('SECURE_AUTH_SALT', '34|%naC(4:m6r_s%-_(XgRr#i[TV3PLk5F63HN49pWCvTsq3sbGYiLl0|4;v2lni');
define('LOGGED_IN_SALT', '9fLK0_-!eG2lKYjMp3Mw%+83O+lT-i%156q-IT2h4/av%6-40)/*(Po1]NE#NIbT');
define('NONCE_SALT', 'gf:AX0)LG32l/xB0rqT%O9LS2R/4AC_4wG8EmX!zp5M~LM7gB1jbw[9J4xj;6c&e');
define('JWT_AUTH_SECRET_KEY', '|Csx`tJCfnzZLKp|ln,3n~7p8,<|:omzkLsU/{ EuC..I&%u-c@Y=ttHiJr?5vUj');

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


define('WP_ALLOW_MULTISITE', true);
define('JWT_AUTH_CORS_ENABLE', true);

define('WP_DEBUG', true);
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );

define( 'WP_REDIS_PREFIX', 'wp_37674278e3e57a11df727b3758557fca' );
/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) )
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';

