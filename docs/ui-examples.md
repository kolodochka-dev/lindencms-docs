# Ui Examples

This section provides ready-to-use examples of all available field types and Nodes in LindenCMS. You can either copy individual elements for your own Nodes, or add the entire UiExample class to your project configuration to see how everything looks in the interface.

```php
<?php

namespace LindenCMS\Cms\Nodes;

use LindenCMS\Cms\Attributes\View;
use LindenCMS\Cms\Attributes\Validation;
use LindenCMS\Cms\Attributes\File;
use LindenCMS\Cms\Attributes\Relationship;

#[View(
    label: 'Ui Example',
    labelMany: 'Uis',
    icon: 'eva:cube-fill',
    index: ['string', 'created_at', 'updated_at'],
    singlePage: true,
)]
class UiExample extends AppNode
{
    #[View(label: 'string', asOption: true)]
    public _String $string;
    
    public _Int $int;
    
    public _Text $text;

    #[View(label: 'select', options: ['first', 'second', 'third'])]
    public _Select $select;

    public _Bool $bool;

    #[View(label: 'checkbox', option: 'checked value')]
    public _Checkbox $checkbox;

    #[View(label: 'radio', options: ['first', 'third', 'first'])]
    public _Radio $radio;

    #[View(label: 'range', min: 1, max: 100)]
    public _Range $range;

    public _Email $email;

    #[View(label: 'rich text')]
    public _RichText $rich_text;

    #[View(label: 'Files')]
    public FileUploads $files;

    #[View(label: 'Single image')]
    #[File(multiple: false)]
    #[Validation('file|extensions:jpg')]
    public FileUploads $image;

    // #[Relationship(RootNode::class)]
    // public Relation $node;

    // #[Relationship(RootNode::class)]
    // public Relations $nodes;
}
```

> [!NOTE]
> `Relationships` docs are in progress

