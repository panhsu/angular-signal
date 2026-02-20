import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

@Component({
  selector: 'app-tree-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  templateUrl: './step2.html'
})
export class TreeAutocompleteComponent {

  search = signal('');
  selected = signal<string | null>(null);

  treeData: TreeNode[] = [
    {
      id: 'fruit',
      label: 'Fruit',
      children: [
        { id: 'apple', label: 'Apple', children:[{id:'kiwi', label:'Kiwi', children:[]}] },
        { id: 'banana', label: 'Banana' }
      ]
    },
    {
      id: 'vegetable',
      label: 'Vegetable',
      children: [
        { id: 'carrot', label: 'Carrot' },
        { id: 'broccoli', label: 'Broccoli' }
      ]
    }
  ];

  flatData = computed(() => {
    const flattened = this.flatten(this.treeData);
    const keyword = this.search().toLowerCase();

    if (!keyword) return flattened;

    return flattened.filter(item =>
      item.label.toLowerCase().includes(keyword)
    );
  });

  private flatten(nodes: TreeNode[], level = 0): any[] {
    return nodes.flatMap(node => {
      const current = [{
        id: node.id,
        label: node.label,
        level,
        hasChildren: !!node.children
      }];

      if (node.children) {
        return current.concat(this.flatten(node.children, level + 1));
      }

      return current;
    });
  }

  selectOption(item: any) {
    if (!item.hasChildren) {
      this.selected.set(item.id);
      this.search.set(item.label);
    }
  }

  isGreen(item: TreeNode) : boolean
  {
    if(item.label !== 'Kiwi') return true;
    return false;
  }
}