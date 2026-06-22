# Configuration

After running `php artisan lindencms:install`, a configuration file is published to config/lindencms.php. This file contains all the settings that control how LindenCMS behaves.

Here's the default configuration with all available options:

```php
<?php

use LindenCMS\Cms\Nodes\File;
use LindenCMS\Cms\Nodes\User;

return [
    // Nodes
    'nodes' => [
        'users' => User::class,
        'files' => File::class,
    ],
    'navigation' => [
        // ...
    ],
    'dashboard' => [
        // ...
    ],

    // Routes
    'route_prefix' => 'lindencms',

    // Storage
    'storage_path' => 'lindencms',
    'storage_placeholders_path' => 'lindencms/placeholders',
    'default_accept' => [
        'image/*'
    ],

    // Site
    'public_views' => 'pages',

    // Database
    'table_prefix' => 'cms',
];
```

## Nodes

The nodes array registers all **root Nodes** in your CMS. These are the top-level content types. Registered entities will appear in the admin interface only after configuring the navigation option (see below).

```php
'nodes' => [
    'users' => User::class,
    'files' => File::class,
    'memberships' => Membership::class,
    'areas' => Area::class,
    'about' => About::class,
    'gallery' => Gallery::class,
    'leads' => Lead::class,
    'products' => Product::class,
],
```

**Key points:**
- The key ('users', 'files', etc.) is the unique identifier for this Node type
- The value is the fully qualified class name of your Node class

## Navigation

The navigation array defines the structure of the admin sidebar navigation.

```php
'navigation' => [
    'content' => [
        Membership::class,
        Area::class,
        Lead::class,
        Product::class,
    ],
    'pages' => [
        About::class,
        Gallery::class,
    ],
],
```

**Key points:**
- The key ('content', 'pages', etc.) is the group names
- To pin an entity without a group, add it under the `''`(empty string) key
- Nested groups implementation in progress
- Icons and labels that apear in navigation links can be configured throug the `View` attributes:

```php
#[View(
	label: 'Product',
	labelMany: 'Products',
	icon: 'mdi:package-variant',
)]
class Product extends AppNode
```

**Icon library:** [Iconify](https://icon-sets.iconify.design/) icon set is used. You can browse available icons at the Iconify website.

## Dashboard

The dashboard array defines which entities appear as quick-access widgets on the admin dashboard.

```php
'dashboard' => [
    Area::class,
    Membership::class,
    Lead::class,
    About::class,
    Gallery::class,
],
```

## Routes

The route_prefix option sets the URL prefix for all CMS routes.

```php
'route_prefix' => 'lindencms',
```

## Storage

Storage options control where uploaded files and media are stored.

```php
'storage_path' => 'lindencms',
'storage_placeholders_path' => 'lindencms/placeholders',
'default_accept' => [
    'image/*'
],
```

**Key points:**
- `storage_path` - base directory for uploaded files. Override via `path` parameter in `File` attribute on `FileUploads` Node
- `storage_placeholders_path` - directory for placeholder images. Override via `pathPreview` parameter in `File` attribute on `FileUploads` Node
- 'default_accept' - default allowed file types for uploads. Override via `accept` parameter in `View` attribute on `FileUploads` Node

```php
class Product extends AppNode
{
    #[File(multiple: false, path: 'product', pathPreview: 'product/previews')]
    public FileUploads $image;
}
```

## Site

The public_views option defines the templates path under the `resources/views` folder.
This is used for rendering public-facing content. If you prefer to use `Pages`, this setting points to where your page templates are stored.

For more information: See the [client site](/client-site) section

## Database

**REQUIRED**

The table_prefix option adds a prefix to all CMS database tables.