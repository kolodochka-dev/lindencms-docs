# Client site (Frontend)

LindenCMS provides two ways to build your public-facing website:
1. Pages — Declarative approach with automatic data loading
2. Manual — Traditional Laravel controllers and models

## Pages (Declarative Approach)

The `Page` system allows you to define what data is needed for a page, and LindenCMS automatically loads it.

### Creating a Page Class
Simply declare a `Page` class, specify which root Nodes you need on this page and use the `Load` attribute to declare loading logic:

```php
<?php

namespace App\Nodes\Pages;

use App\Nodes\Membership;
use App\Nodes\About;
use Illuminate\Http\Request;
use LindenCMS\Cms\Attributes\Load;
use LindenCMS\Cms\Attributes\Eager;
use LindenCMS\Core\Attributes\Collection;
use LindenCMS\Cms\Nodes\AppNodeCollection;
use LindenCMS\Cms\Nodes\Page;
use LindenCMS\Cms\Exceptions\LoadException;

class MembershipsPage extends Page
{
    #[Load(static function (AppNodeCollection $node, Request $request) {
        if (!$node->context('db.read')->read()) {
            throw new LoadException(abort(404));
        }
    })]
    #[Collection(type: Membership::class)]
    public AppNodeCollection $memberships;

    #[Load(static function (About $node) {
        $node->context('db.read-first');
    })]
    // #[Eager(['image'])] // Work in progress
    public About $about;
}
```

### Defining the Route

Register your Page in the routes file:

```php
Route::get('/about', AboutPage::class)->name('site.about');
```

### Creating the View

By default, views are located in resources/views/pages/ with the class name in kebab-case:

`resources/views/pages/memberships-page.blade.php`

```html
<div>
    <h2>{{ $page->about->title }}</h2>
    <p>{{ $page->about->description }}</p>
</div>
```

You can customize the view path in the Configuration section.

## Manual Approach (Traditional Laravel)

If you prefer more control, you can use traditional Laravel patterns. Since LindenCMS automatically generates and maintains the database schema for you, you can retrieve data by manually writing standard Laravel Eloquent Models or Queries.