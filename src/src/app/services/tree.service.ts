import { Injectable, signal, computed, effect,inject } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { HttpClient } from '@angular/common/http';

export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

@Injectable({
  providedIn: 'root',
})
export class WizardService {
  private http = inject(HttpClient);

  // --------------------------
  // Tree signals
  // --------------------------
  readonly treeData = signal<TreeNode[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  treeControl = new NestedTreeControl<TreeNode>((node) => node.children);
  dataSource = computed(() => this.treeData());

  // 已選中的 node id
  readonly selectedIds = signal<Set<string>>(new Set());

  // --------------------------
  // Tree helper functions
  // --------------------------
  hasChild = (_: number, node: TreeNode) => !!node.children?.length;

  getAllDescendants(node: TreeNode): TreeNode[] {
    if (!node.children?.length) return [];
    return node.children.flatMap((c) => [c, ...this.getAllDescendants(c)]);
  }

  isChecked(node: TreeNode): boolean {
    if (!node.children?.length) return this.selectedIds().has(node.id);
    else return false;
    //const descendants = this.getAllDescendants(node);
    //return descendants.every((d) => this.selectedIds().has(d.id));
  }



  toggleNode(node: TreeNode) {
    const set = new Set(this.selectedIds());
    if (this.isChecked(node)) {
      set.delete(node.id);
      //this.getAllDescendants(node).forEach((d) => set.delete(d.id));
    } else {
      set.add(node.id);
      //this.getAllDescendants(node).forEach((d) => set.add(d.id));
    }
    this.selectedIds.set(set);
  }

  // --------------------------
  // API call
  // --------------------------
  loadTree(url: string) {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<TreeNode[]>(url).subscribe({
      next: (data) => {
        this.treeData.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('資料載入失敗');
        this.loading.set(false);
      },
    });
  }
}
