# Introduction to LindenCMS

Every developer knows the feeling. You need to add a new content type to your CMS. What should be a simple task becomes a marathon:
1. Write a migration
2. Create a model
3. Build a controller
4. Design the form views
5. Add validation rules
6. Set up API endpoints
7. Configure the admin panel
8. Test everything

**Hours** — sometimes **days** — of work for what should be a simple data structure.

## How It All Started

It started with a tool for automatically generating admin panel interfaces — a classic form generation problem.

To avoid working with arrays that lack strict typing, a strategy was chosen: declare entities whose properties can be transformed into views simply by defining their types. For example, bool → checkbox, string → input.

But what about form elements that don't have a corresponding built-in type? textarea, select, range? The solution was to use custom types, which also provide an opportunity to have additional methods that base types doesn't. That's how the NodeValue class came about:

```php
abstract class NodeValue
{
    abstract public function set(mixed $value);
    abstract public function get(): mixed;
}
```

And its implementations: _String, _Int, _Text, _Select, and others.

```php
class _String extends NodeValue
{
    protected ?string $value = null;

    public function set(mixed $value)
    {
        $this->value = $value;
    }

    public function get(): mixed
    {
        return $this->value;
    }
}
```

> [!NOTE]
> Since PHP doesn't allow using names that conflict with built-in type declarations, all value classes are prefixed with an underscore `_`

Now declaring a business entity became simple:

```php
class Product
{
    public _String $title;
    public _Text $description;
}
```

And since we can get enough information about entity structure we can render a form:

```html
<form>
    <input name="title">
    <textarea name="description"></textarea>
</form>
```

## Attributes

The next question was dynamic data: labels, attributes (`min`, `max`, `readonly`, `default`, `placeholder`, etc.). One option was to use mapper methods that define a set of parameters for each property — but that would mean working with arrays whose format and values aren't always obvious.

To write self-documenting code, attributes were chosen:
- They have a static set of parameters
- They can be applied to both properties and classes (which later became an important feature)
- In PHP 8.5, attribute properties can even use closures

This is how the `View` attribute was born:

```php
#[Attribute(Attribute::TARGET_PROPERTY | Attribute::TARGET_CLASS)]
class View
{
    public function __construct(
        public string $label = '',
        public string $labelMany = '',
        public string $type = '',
        public bool $hidden = false,
        public bool $readonly = false,
        public bool $disabled = false,
        public bool $required = false,
        public string $placeholder = '',
        public string $icon = '',
    ) {}
}
```

And here's how it's used:
```php
class Product
{
    #[View(label: 'Product name', placeholder: 'product name')]
    public _String $title;

    #[View(label: 'Description')]
    public _Text $description;
}
```

**What does this give us?**
- IDE autocomplete
- No need to build complex array or method structures
- The class describes data, not behavior
- Most importantly — readability, and therefore speed of changes

> [!NOTE]
> To handle easy metadata access a base class Node was designed. You can learn more about it in the [Architecture](/architecture) section.

Now the layer that generates HTML knows how to build the form:
```html
<form>
    <label>Product name</label>
    <input name="title" placeholder="product name">

    <label>Description</label>
    <textarea name="description"></textarea>
</form>
```

A simplified example of how CMS generate markup:
```html
<form>
    <label>{$product->title->view()->label}</label>
    <input name="title" placeholder="$title->view()->placeholder">

    <label>{$product->description->view()->label}</label>
    <textarea name="description"></textarea>
</form>
```

## Type + Metadata
There is a data type and its metadata(the information needed to process that type in a given **context**). In the example above, it's the form generation **context** . But the context can be anything: database schema generation, validation, API resources, permissions, search — anything.

This is LindenCMS:
- You describe what — the data and its metadata.
- The CMS knows how — how to output CRUD forms, how to validate requests, how to migrate database schema, and more.

The developer describes data structures and how they should behave (without implementing the behavior itself). The CMS handles the rest.

Here's what a full Node looks like:

```php
#[View(
    label: 'Product',
    labelMany: 'Products',
    icon: 'mdi:package-variant',
    index: ['title', 'price', 'stock', 'created_at'],
    filterable: ['id', 'title', 'price'],
    sortable: ['id', 'title', 'price', 'created_at'],
)]
class Product extends AppNode
{
    #[View(label: 'Product name', placeholder: 'product name')]
    #[Validation('required|min:3')]
    #[Database('string')]
    public _String $title;

    #[View(label: 'Description')]
    #[Database('text')]
    public _Text $description;
}
```

- The `Database` attribute is used by the migration service. 
- The `Validation` attribute is used by the request validation service.

## The Admin Is Ready — Instantly

Here is where LindenCMS transforms your development workflow.

**After you define your Node, simply run:**

```bash
php artisan lindencms:sync
```

This command synchronizes your database schema with your Node declaration — creating tables, columns, and relationships based on your attributes.

But here's the magic: Your admin interface is immediately ready to manage the new entity — with zero additional code.

**What you DON'T need to write**
- Migrations — No **create_products_table.php**
- Models — No **Product extends Model** with fillable/guarded
- Controllers — No **ProductController** with CRUD methods
- Views — No **Blade files** for forms or tables
- Routes — No **Route::resource('products', ProductController::class)**
- Form Requests — No validation **rules classes**

One class. One command. Done.

## Why This Matters to You

Imagine you receive a page mockup. You need to add a new content type.

**With the traditional approach:** `Migration` → `Model` → `Controller` → `Form` → `Validation` → `API`.

**With LindenCMS:** One class → `php artisan lindencms:sync` → Done.

**Reduced development time** compared to custom development, while preserving its flexibility.

You describe the structure once. Everything else — database schema, forms, validation, API, admin interface — is ready automatically. But unlike off-the-shelf CMS platforms, you don't lose flexibility. Your code remains your code. You control every attribute, every field, every rule.

And since this is a code-first CMS, the client part can be implemented in any way you like, in the form of an API, a classic monolith approach, or anything else.