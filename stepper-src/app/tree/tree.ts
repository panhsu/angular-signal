import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { FormControl, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  name: string;
  selected: boolean;
  children: FoodNode[] | null;
  type: number; //1: root, 2: group 3: endpoints
}

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'app-tree',
  templateUrl: './tree.html',
  styleUrl: './tree.scss',
  imports: [MatTreeModule, MatButtonModule, MatIconModule,ReactiveFormsModule, MatCheckboxModule, MatStepperModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tree {
  treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  returnData: Map<FoodNode, FoodNode[]> = new Map();
  selectedNodes: FoodNode[] = [];
  constructor() {
    this.dataSource.data = EXAMPLE_DATA;
    this.expandNodeExcludeType(this.dataSource.data,4);
    
  }

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  treeStepControl = new FormControl(false, Validators.requiredTrue);
  

  getSelectedNodesPath(nodes: FoodNode[]) {
    let path: FoodNode[] = [];
    const selectedNodes: FoodNode[] = [];
    const skipChildrenNodes: FoodNode[] =[];
    this.getSelectedNodes(EXAMPLE_DATA,skipChildrenNodes ,selectedNodes);
    for (const node of selectedNodes) {
      this.getPath(EXAMPLE_DATA, node, path);
      console.log('select node: ' + node.name);
      this.returnData.set(node, path);
      path = [];
    }

  }

  getSelectedNodes(nodes: FoodNode[], skipChildrenNodes: FoodNode[], selectedNode: FoodNode[]):void {
  
   
    //if type3
    for (const node of nodes) {
      if (node.type === 4 || skipChildrenNodes.includes(node)) continue;
      if (node.children) {
        if ((node.type === 2 || node.type === 3) && node.children?.every((x) => x.selected)) {
          selectedNode.push(node);
          node.children.every((x) => skipChildrenNodes.push(x));
        }
        this.getSelectedNodes(node.children, skipChildrenNodes, selectedNode);
      }
    }

  }

  getPath(nodes: FoodNode[], selectedNode: FoodNode, selectedNodePath: FoodNode[]): boolean {
    for (const node of nodes) {
      if (node.name === selectedNode.name) {
        selectedNodePath.push(node);
        return true;
      }
      if (node.children) {
        let found = this.getPath(node.children, selectedNode, selectedNodePath);
        if (found) {
          selectedNodePath.unshift(node);
          return true;
        }
      }
    }
    return false;
  }

  onNodeToggle(node: FoodNode, checked: boolean) {
  if (checked) {
    this.selectedNodes.push(node);
  } else {
    this.selectedNodes = this.selectedNodes.filter(n => n !== node);
  }
  this.treeStepControl.setValue(this.selectedNodes.length > 0);
  this.treeStepControl.markAsTouched();
  this.treeStepControl.updateValueAndValidity();
}

  expandNodeExcludeType(nodes: FoodNode[], excludeType:number)
  {
    for(const node of nodes)
    {
      const hasExcludedChild = node.children?.some(child => child.type === excludeType);

      if (!hasExcludedChild && node.children?.length) {
        this.treeControl.expand(node); 
      }
      if (node.children) {
        this.expandNodeExcludeType(node.children, excludeType);
      }
    }
  }
}


const EXAMPLE_DATA: FoodNode[] = [
  {
    name: 'Vegetables',
    selected: false,
    type: 1, //root
    children: [
      {
        name: 'Green',
        selected: false,
        type: 2, //tenant
        children: [
          //3: group
          {
            name: 'Broccoli',
            selected: false,
            type: 3,
            children: [
              {
                name: 'Apple',
                selected: false,
                type: 3,
                children: [{ name: 'Charry', selected: false, type: 4, children: null }],
              },
            ],
          },
          { name: 'Brussels sprouts', selected: false, type: 3, children: null },
        ],
      },
      {
        name: 'Orange',
        selected: false,
        type: 2,
        children: [
          {
            name: 'Pumpkins',
            selected: false,
            type: 3,
            children: [{ name: 'Ananas', selected: false, type: 4, children: null }],
          },
          { name: 'Carrots', selected: false, type: 3, children: null },
        ],
      },
    ],
  },
];
