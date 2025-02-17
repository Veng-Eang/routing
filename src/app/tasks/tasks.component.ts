import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskComponent } from './task/task.component';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  imports: [TaskComponent,RouterLink],
})
export class TasksComponent implements OnInit {
  userId = input.required<string>();
  // order = input<'desc' | 'asc'>();
  order = signal<'desc' | 'asc'>('desc');
  private tasksService = inject(TasksService);
  private ativatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  userTasks = computed(()=>this.tasksService
                                .allTasks()
                                .filter((t)=>t.userId === this.userId())
                                .sort((a,b)=>{
                                  if(this.order() === 'desc'){
                                    return a.id > b.id ? -1 : 1;
                                  }else{
                                    return a.id > b.id ? 1 : -1;
                                  }
                                }));

  ngOnInit(): void {
      const subscription = this.ativatedRoute.queryParams.subscribe({
        next: param => this.order.set(param['order'])
      });

      this.destroyRef.onDestroy(()=>{
        subscription.unsubscribe();
      });
  }
}
