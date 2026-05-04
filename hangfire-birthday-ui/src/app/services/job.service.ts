import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface JobTriggerResponse {
  message: string;
  jobId: string;
  triggeredAt: string;
}

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly base = '/api/jobs';

  constructor(private http: HttpClient) {}

  triggerBirthday(): Observable<JobTriggerResponse> {
    return this.http.post<JobTriggerResponse>(`${this.base}/trigger/birthday`, {});
  }
}
