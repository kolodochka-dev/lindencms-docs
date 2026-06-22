# LindenCMS Architecture

LindenCMS is built on a flexible, extensible architecture centered around three core concepts:

- **Nodes** — Content entities that compose other nodes into logical structures
- **NodeValues** — Typed property values that hold data
- **NodeCollections** — Collections of Nodes

All three work together through the Context system, which provides behavior for different use cases.

## Node System

### Node Initialization

Every Node class is initialized from the static `Product::make()` method, which recursively instantiates all properties with Node types:

```php
$product = Product::make();
// All product properties are also instantiated
```

### Node Attributes

During initialization, all declared attributes are saved inside the $nodeAttributes property to provide runtime access. For easier access, helper methods are implemented with static return types to give IDE autocomplete:

```php
public function _view(): ?View
{
    return $this->nodeAttributes[View::class] ?? null;
}
// Similarly: _database(), _validation(), _eager(), etc.
```

This allows you to access attribute data cleanly:

```php
$product->_view()->label;
```

#### Attribute Inheritance and Override

Attributes can be defined directly on `Node` classes. These attributes apply to every instance of that `Node` type:

```php
#[Database('string')]
#[Validation('max:255')]
class _String extends AppNodeValue
{
    // ...
}
```

Now every `_String` property in any `Node` will have:
- Database attribute with 'string'
- Validation attribute with 'max:255'

Attributes can also be defined on properties level. When you define attributes on a property, they completely replace the class-level attributes for that specific property:

```php
class Product extends AppNode
{
    #[Database('text')]
    #[Validation('max:1024')]
    public _String $title;
}
```

Now the `$title` property in Product will have:
- Database attribute with 'text'
- Validation attribute with 'max:1024'

> [!WARNING]
> The attributes on the property do not merge with attributes on the `_String` class. They fully replace them.

### The Context System

For behavior implementation, a Context system was designed. This is the core architectural pattern that makes LindenCMS flexible and extensible.

> [!NOTE]
> The Context system is available for every Node, NodeValue, NodeCollection, and any other Node inheritors. This means you can attach behavior to any level of your data structure — from a single property value to a collection of entities.

#### Understanding Contexts

A Context is essentially a behavior handler attached to a Node. Each context knows how to interpret a Node for a specific purpose — whether that's generating HTML, handling database operations, validating data, or anything else.

The CMS consists of multiple packages, with two primary ones being Core and CMS. The `AppNode` class is built upon the Core `Node` class and contains all the necessary logic for building a CMS.

Here's what the `AppNode` context configuration looks like:

```php
class AppNode extends Node
{
    public function __construct()
    {
        $this->contexts = [
            // Database
            'db.schema' => SchemaContext::class,
            'db.query' => QueryContext::class,
            // ...
            
            // HTML
            'html.form' => FormContext::class,
            'html.tr' => TrContext::class,
            // ...
            
            // HTMX
            'htmx.save' => SaveContext::class,
            'htmx.delete' => DeleteContext::class,
            // ...
            
            // Validation
            'valid.rules' => RulesContext::class,
            'valid.messages' => MessagesContext::class,
            // ...
        ];
    }
}
```

#### How Contexts Work

Every context extends the abstract `LindenCMS\Core\Contexts\Context` class, which provides the foundation for behavior handling. 
The key elements of the `Context` class are:
- `__invoke()` — An abstract method that each context must implement. This is where the actual behavior logic lives.
- **Auto-injected Node** — Each context automatically receives the Node instance it's attached to.

Here's a basic context that renders a table row:

```php
class TrContext extends Context
{
    /** @var Product */
    protected Node $node;

    public function __invoke(): mixed
    {
        return <<< HTML
            <tr>
                <td>{$this->node->title}</td>
                <td>{$this->node->description}</td>
            </tr>
        HTML;
    }
}
```

Here's a more practical example showing how contexts handle HTMX interactions:

```php
abstract class HtmxContext extends Context
{
    protected function build_htmx_string(array $attributes): string
    {
        return implode(' ', array_map(
            fn($k, $v) => "$k='$v'",
            array_keys($attributes),
            $attributes
        ));
    }
}

class DeleteContext extends HtmxContext
{
    /** @var AppNode */
    protected Node $node;

    public function __invoke(): mixed
    {
        return $this->build_htmx_string([
            'hx-delete' => route('nodes.delete', [
                'code' => $this->node->code(),
                'id' => $this->node->id->get(),
            ]),
            'hx-target' => 'closest tr',
            'hx-headers' => json_encode(['X-CSRF-TOKEN' => csrf_token()]),
            'hx-disabled-elt' => 'this',
            'hx-vals' => json_encode(['_method' => 'DELETE']),
            'hx-confirm' => 'Are you sure you want to delete this record?'
        ]);
    }
}
```

You can call any context by name:

```php
$product->context('html.tr');
// This calls the __invoke() method and returns the result
```

#### What Does This Give Us?

**`Inherited Behavior`**

Since every behavior is attached to the Node, all behavior is automatically inherited by descendants. You don't need to re-implement behavior in every Node class.

**`Override Capability`**

Even though behavior is inherited, it can still be overridden. This gives you the best of both worlds — sensible defaults with the ability to customize when needed.

**`Separation of Concerns`**

The `Node` describes what the data is. `Contexts` describe how to handle that data in different situations. This clean separation makes the code more maintainable and testable.

**`Extensibility`**

Adding new behavior is as simple as creating a new context class and registering it.

#### Customizing Behavior

If you need to customize some behavior — whether database, HTML, or anything else — you simply implement a new context and add it to your Node:

```php
protected function extendContexts(): array
{
    return [
        'html.form' => OurNewFormContext::class,
    ];
}
```

#### The Inheritance Flow

**Node (Core)** -> **AppNode (CMS)** -> **Product (Your Node)**

- Core `Node` — Provides the foundation: property handling, attribute access, context system
- `AppNode` — Adds CMS-specific contexts: database, HTML, HTMX, validation
- `Product` — Your custom Node with your specific properties and attributes

Because `AppNode` contains all the necessary logic for building a CMS, every Node you create by inheriting from `AppNode` automatically gets full CMS capabilities.

### Node Composition

One of the most powerful features of LindenCMS is that any inheritor of `Node` can be a property of another `Node`.
This is made possible by the recursive initialization logic mentioned earlier in the Node Initialization section. When a Node is instantiated via the static `make()` method, the system recursively instantiates all properties that extend Node — whether they are single `NodeValues`, `NodeCollections` or nested `Nodes`.

This means you can compose complex, nested content structures where one piece of content contains another — at any level of your data hierarchy.

```php
class Product extends AppNode
{
    public Feature $feature;
}

class Feature extends AppNode
{
    #[Validation('required')]
    public _String $text;
    
    #[Validation('required')]
    public _String $stars;
}
```

> [!WARNING]
> **Important Limitation:** You cannot use a Node inside another Node if both are **root Nodes** connected to the configuration. **Root Nodes** are top-level entities that are directly registered in the CMS configuration. Using a root Node as a property of another root Node would create a circular reference, causing an infinite recursion loop during initialization.
Root Nodes should remain as independent, top-level content types in your CMS configuration.
For more information about root Nodes and configuration, see the [Config](/config) section.


### Summary

1. `Node` - Describes data structure
2. `Attributes` - Provide metadata
3. `Contexts` - Define behavior for different use cases

This architecture gives you the power of a fully-featured CMS while maintaining complete flexibility. Every piece of behavior is a replaceable context, meaning you can customize anything.

## NodeValue System

While Nodes define the structure of your content, NodeValues actually hold the data. Think of Nodes as the blueprint and NodeValues as the actual values stored within that blueprint.

### The Core NodeValue

Every NodeValue extends the abstract `LindenCMS\Core\NodeValue` class, which provides the foundation for all value types:

```php
abstract class NodeValue extends Node
{
    abstract public function set(mixed $value);
    
    abstract public function get(): mixed;
}
```

**Key methods:**
- `set(mixed $value)` — Stores the value
- `get(): mixed` — Retrieves the value

Here's what a basic _String NodeValue looks like:

```php
#[Database('string')]
class _String extends AppNodeValue
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

### Usage

When you instantiate a Node, all its `NodeValue` properties are automatically instantiated:

```php
$product = Product::make();

// Set
$product->title->set('My Product');
$product->price->set(99.99);

// Get
$title = $product->title->get(); // "My Product"
$price = $product->price->get(); // 99.99
```

## NodeCollection System

While a single Node can hold another Node as a property, NodeCollection allows you to hold multiple Nodes of a specific type. This enables you to build one-to-many relationships in your content structures.

Think of it this way:
- Node as property — One-to-one relationship
- NodeCollection — One-to-many relationship

```php
class Product extends AppNode
{
    #[Collection(Feature::class)]
    public AppNodeCollection $features;
}

class Feature extends AppNode
{
    #[Validation('required')]
    public _String $text;
    
    #[Validation('required')]
    public _String $stars;
}
```

The `#[Collection]` attribute defines the type of `AppNode` the collection will hold.

LindenCMS collection is implementing \Countable and \IteratorAggregate PHP interfaces.
