// tree.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TreeService {
  // Signals 保存最新 tree
  treeSig = signal<TreeNode[]>([]);

  setTree(tree: TreeNode[]) {
    this.treeSig.set(tree);
  }
}
