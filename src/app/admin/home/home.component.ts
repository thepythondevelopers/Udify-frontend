import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  chart: any = {
    title: 'Pie Chart',
    type: 'PieChart',
    data: [
      ['Firefox', 45.0],
      ['IE', 26.8],
      ['Chrome', 12.8],
      ['Safari', 8.5],
      ['Opera', 6.2],
      ['Others', 0.7],
    ],
    columnNames: ['Browser', 'Percentage'],
    options: {
      colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'],
      is3D: true,
    },
  };
  constructor() {}

  ngOnInit(): void {}
}
