# Quick start



> [!WARNING]
> **Early Beta — Not Production-Ready!**

LindenCMS is currently in early beta and is not recommended for production use at this stage.

What to expect:
- Breaking changes — APIs and features may change without notice
- Missing features — Some functionality is not yet implemented
- Incomplete documentation — Docs are actively being written
- Bugs — Edge cases and issues are being discovered and fixed
- Optimization issues

Who this is for:
- Developers exploring new CMS architectures
- Learning and experimentation
- Building prototypes and proof-of-concepts

Who this is **NOT** for:
- Production websites
- Mission-critical applications
- Client projects without clear communication about beta status

## Requirements
 
 -   PHP 8.5
 
 -   MySQL 8.0+ (other databases not officially tested)
 
 -   Laravel 12.x or 13.x
    
 -   Composer
 
## Installation

####  Create a new Laravel project as usual or use an existing one:

```bash
composer create-project laravel/laravel my-project
cd my-project
```

#### Require the LindenCMS package:
   
```bash
composer require lindencms/cms
```

#### Run the install command to publish assets and create an admin user:

```bash
php artisan lindencms:install
```

> [!WARNING]
> If you see warnings during installation about running `sync`, just run: 
`php artisan lindencms:sync`

'Sync' is the most important command you will use. It synchronizes your Node definitions with the database schema — similar to `php artisan migrate`, but specifically for your content models.

## Declaring Your First data Node

A Node is your main content model — like a database table, but defined in pure PHP using node composition and attributes.

Here is a complete example:

```php
<?php

namespace App\Nodes;

use LindenCMS\Cms\Attributes\File;
use LindenCMS\Cms\Attributes\Validation;
use LindenCMS\Cms\Attributes\View;
use LindenCMS\Cms\Nodes\_String;
use LindenCMS\Cms\Nodes\_Text;
use LindenCMS\Cms\Nodes\_Float;
use LindenCMS\Cms\Nodes\_Int;
use LindenCMS\Cms\Nodes\_Bool;
use LindenCMS\Cms\Nodes\AppNode;
use LindenCMS\Cms\Nodes\FileUploads;

#[View(
	label: 'Product',
	labelMany: 'Products',
	icon: 'mdi:package-variant',
	index: ['title', 'price', 'created_at'],
	filterable: ['id', 'title', 'price'],
	sortable: ['id', 'title', 'price', 'created_at'],
)]
class Product extends AppNode
{
	public _String $title;
	
	public _Text $description;
	
	#[View(label: 'Price (USD)')]
	#[Validation('required|numeric|min:0')]
	public _Float $price;
}
```


#### Connecting to Config

After creating your Node class, you must register it in `config/lindencms.php`:

```php
<?php

use App\Nodes\Product;
use LindenCMS\Cms\Nodes\File;
use LindenCMS\Cms\Nodes\User;

return [
	// Nodes
	'nodes'  =>  [
		'users'  =>  User::class,
		'files'  =>  File::class,
		'products'  =>  Product::class, // <-- here
	],
	'navigation'  =>  [
		'content'  =>  [
			Product::class, // <-- optional
		],
	],
	'dashboard'  =>  [
		Product::class,	// <-- optional
	],

	// ...
```
**`nodes`** - array of all Node classes. Keys are slugs used in admin URLs

**`navigation`** - organizes Nodes into sidebar menu by groups

**`dashboard`** - which Nodes appear on the CMS dashboard

For a complete configuration reference, see the [Config](/config) page.

#### Final

Now that your Node is declared and registered in the config, run

```bash
php artisan lindencms:sync
```

That's it. Now **Product** entity is fully ready for content management.

---

**What's Next?**

-   Understand [Architecture](/architecture)
-   See more [UI Examples](/ui-examples)
    
