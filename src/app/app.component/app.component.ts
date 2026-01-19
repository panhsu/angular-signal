import { Component, signal  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { JsonPipe,CommonModule } from '@angular/common';
import { TreeService } from '../services/tree.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [MatStep, MatStepper,ReactiveFormsModule,JsonPipe,CommonModule]
})
export class AppComponent {
  private fb = new FormBuilder();

  // --------------------
  // Forms
  // --------------------
  form1 = this.fb.nonNullable.group({
    tree: [
      [
        {
          id: 'node1',
          label: 'Node 1',
          checked: false,
          children: [
            { id: 'node1-1', label: 'Node 1-1', checked: false },
            { id: 'node1-2', label: 'Node 1-2', checked: false },
          ],
        },
        { id: 'node2', label: 'Node 2', checked: false },
      ] as TreeNode[],
    ],
  });

  form2 = this.fb.nonNullable.group({
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    parentNodes: [''],
  });

  form3 = this.fb.nonNullable.group({
    city: ['', Validators.required],
    country: ['', Validators.required],
  });

  formConfirm = this.fb.nonNullable.group({});

  // --------------------
  // Signals
  // --------------------
  activeStep = signal(0);

  treeSig = signal(this.form1.value.tree??[]);

  constructor(private treeService: TreeService) {
    // 初始化 service 的 signal
    this.treeService.setTree(this.treeSig());
  }

  steps = signal([
    { id: 'basic', label: '選擇節點', form: this.form1 },
    { id: 'account', label: '帳號設定', form: this.form2 },
    { id: 'address', label: '地址資料', form: this.form3 },
    { id: 'confirm', label: '確認送出', form: this.formConfirm },
  ]);

  // --------------------
  // Stepper helper
  // --------------------
  nextStep() {
    if (this.activeStep() < this.steps().length - 1) {
      this.activeStep.set(this.activeStep() + 1);
    }
  }

  prevStep() {
    if (this.activeStep() > 0) {
      this.activeStep.set(this.activeStep() - 1);
    }
  }

  // --------------------
  // Tree toggle
  // --------------------
  toggleNode(nodeId: string) {
    const tree = this.form1.controls['tree'].value ?? [];
    const updatedTree = this.updateTree(tree, nodeId);

    this.form1.controls['tree'].setValue(updatedTree);

    const parents = this.getParentNodesOfChecked(updatedTree);
    this.form2.controls['parentNodes'].setValue(parents.map(p => p.label).join(', '));
  }

  updateTree(nodes: TreeNode[], nodeId: string): TreeNode[] {
    return nodes.map(node => {
      const newNode: TreeNode = { ...node };
      if (node.id === nodeId) newNode.checked = !node.checked;
      if (node.children) newNode.children = this.updateTree(node.children, nodeId);
      return newNode;
    });
  }

  getParentNodesOfChecked(nodes: TreeNode[]): TreeNode[] {
    let result: TreeNode[] = [];
    for (const node of nodes) {
      if (node.children) {
        const childChecked = node.children.some(child => child.checked);
        if (childChecked) result.push(node);
        result = result.concat(this.getParentNodesOfChecked(node.children));
      }
    }
    return result;
  }
}
