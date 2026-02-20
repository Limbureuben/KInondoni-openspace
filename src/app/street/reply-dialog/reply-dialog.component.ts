import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OpenspaceService } from '../../service/openspace.service';
import { BookingService } from '../../service/booking.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reply-dialog',
  standalone: false,
  templateUrl: './reply-dialog.component.html',
  styleUrl: './reply-dialog.component.scss'
})
export class ReplyDialogComponent {
  replyForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ReplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private reportService: BookingService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.replyForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  // submitReply(): void {
  //   if (this.replyForm.invalid) return;

  //   const message = this.replyForm.value.message;
  //   const reportId = this.data.report?.id || this.data.report?.report_id;
  //   // const reportId = this.data.report.id; // use numeric ID

  //   this.reportService.replyToReport(reportId, message).subscribe({
  //     next: () => {
  //       this.snackBar.open('Reply sent successfully!', 'Close', { duration: 3000 });
  //       this.dialogRef.close(true);
  //     },
  //     error: (err) => {
  //       console.error('Error sending reply', err);
  //       this.snackBar.open('Failed to send reply', 'Close', { duration: 3000 });
  //     }
  //   });
  // }

  submitReply(): void {
    if (this.replyForm.invalid) return;

    const message = this.replyForm.value.message?.trim();
    if (!message) return;

    const reportId = this.data?.report?.id ?? this.data?.report?.report_id;

    if (!reportId) {
      this.snackBar.open('Invalid report ID', 'Close', { duration: 3000 });
      return;
    }

    this.reportService.replyToReport(reportId, message).subscribe({
      next: () => {
        this.snackBar.open('Reply sent successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error sending reply', err);
        this.snackBar.open('Failed to send reply', 'Close', { duration: 3000 });
      }
    });
  }


  onCancel(): void {
    this.dialogRef.close();
  }
}
