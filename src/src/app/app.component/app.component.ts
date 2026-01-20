import { Component, signal, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { MatCheckbox } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { JsonPipe, CommonModule } from '@angular/common';
import { WizardService, TreeNode } from '../services/tree.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { inject } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { CdkTreeModule } from '@angular/cdk/tree';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    MatStep,
    MatStepper,
    ReactiveFormsModule,
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    CdkTreeModule,
    MatCheckbox,
  ],
})
export class AppComponent {
  private fb = new FormBuilder();

  public wizard = inject(WizardService);

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


  constructor() {
    this.wizard.loadTree('http://localhost:3000/tree');
  }

  // Template helpers
  // --------------------------
  treeData = this.wizard.treeData;
  treeControl = this.wizard.treeControl;
  dataSource = this.wizard.dataSource;

  hasChild = this.wizard.hasChild.bind(this.wizard);
  isChecked = this.wizard.isChecked.bind(this.wizard);
  toggleNode = this.wizard.toggleNode.bind(this.wizard);
}
