import { Component, OnInit } from '@angular/core';
import { RealMlbScheduleGenerator } from '../../services/real-mlb-schedule.generator'
import { League } from '../../models/league'
@Component({
  selector: 'app-generate-schedule-test',
  templateUrl: './generate-schedule-test.component.html',
  styleUrls: ['./generate-schedule-test.component.scss']
})
export class GenerateScheduleTestComponent implements OnInit {
  mlbSchedule;
  constructor(private realMlbScheduleGenerator: RealMlbScheduleGenerator) { }

  ngOnInit() {
    this.mlbSchedule = this.realMlbScheduleGenerator.generateRealMlbSchedule(
      [
        [
          ['A1', 'A2', 'A4', 'A4', 'A5'],
          ['B1', 'B2', 'B4', 'B4', 'B5'],
          ['C1', 'C2', 'C4', 'C4', 'C5']
        ],
        [
          ['X1', 'X2', 'X4', 'X4', 'X5'],
          ['Y1', 'Y2', 'Y4', 'Y4', 'Y5'],
          ['Z1', 'Z2', 'Z4', 'Z4', 'Z5']
        ],
      ])
    const y = 2
    const z = 3
  }

}
