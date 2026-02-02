import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

type User = {
  name: string;
  roles: string[];
};

type RowSelection = {
  selectedRole: string | null;
};

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:[MatTableModule, MatFormField,MatSelect,MatOptionModule]
})


export class DynamicForm {

   displayedColumns = ['name', 'role'];

  usersSignal = signal<User[]>([
    { name: 'A', roles: ['Y', 'Z'] },
    { name: 'B', roles: ['T', 'R'] },
  ]);

  // 每列選擇值 signal 改成物件
  selectedRolesSignal = signal<RowSelection[]>(
    this.usersSignal().map(() => ({ selectedRole: null }))
  );

  // 選擇某列 select
  onRoleChange(index: number, value: string) {
    const updated = [...this.selectedRolesSignal()];
    updated[index] = {
      ...updated[index],
      selectedRole: value, // 更新 selectedRole
    };
    this.selectedRolesSignal.set(updated);
  }

  submit() {
    const result = this.usersSignal().map((u, i) => ({
      ...u,
      ...this.selectedRolesSignal()[i],
    }));
    console.log(result);
    /*
    [
      { name: 'A', roles: ['Y','Z'], selectedRole: 'Y' },
      { name: 'B', roles: ['T','R'], selectedRole: 'R' }
    ]
    */
  }
}
