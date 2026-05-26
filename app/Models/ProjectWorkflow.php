<?php

namespace App\Models;

use Database\Factories\ProjectWorkflowFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectWorkflow extends Model
{
    /** @use HasFactory<ProjectWorkflowFactory> */
    use HasFactory;

    protected $fillable = [
        'project_id',
        'definition',
        'version',
    ];

    protected function casts(): array
    {
        return [
            'definition' => 'array',
            'version' => 'integer',
        ];
    }

    /** The Project this workflow belongs to. */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /** Get the empty v1 workflow definition shape. */
    public static function emptyDefinition(): array
    {
        return [
            'version' => 1,
            'type' => 'ordered_stages',
            'nodes' => [],
            'edges' => [],
            'viewport' => [
                'x' => 0,
                'y' => 0,
                'zoom' => 1,
            ],
        ];
    }

    /** Check if this workflow has at least one mandatory node. */
    public function hasMandatoryNode(): bool
    {
        /** @var array<string, mixed> $definition */
        $definition = $this->definition;
        $nodes = $definition['nodes'] ?? [];

        foreach ($nodes as $node) {
            if (! empty($node['mandatory'])) {
                return true;
            }
        }

        return false;
    }
}
