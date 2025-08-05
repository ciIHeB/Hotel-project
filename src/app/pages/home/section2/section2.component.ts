import { Component } from "@angular/core";

@Component({
    selector:"app-section2",
    standalone:true,
    imports:[],
    templateUrl:"./section2.component.html",
    styleUrl:"./section2.component.css",
})

export class Section2App{
    cards = [
        {
            id:1,
            imgSrc:"./assets/roomsImg/img1.jpg",
            title:"STANDART ROOM",
            price:"350.00",
        },
        {
            id:2,
            imgSrc:"./assets/roomsImg/img2.jpg",
            title:"FAMILY ROOM",
            price:"400.00",
        },
        {
            id:3,
            imgSrc:"./assets/roomsImg/img3.jpg",
            title:"SINGLE ROOM",
            price:"255.00",
        },
        {
            id:4,
            imgSrc:"./assets/roomsImg/img1.jpg",
            title:"DELUXE ROOM",
            price:"150.00",
        },
        {
            id:5,
            imgSrc:"./assets/roomsImg/img2.jpg",
            title:"LUXURY ROOM",
            price:"200.00",
        },
        {
            id:6,
            imgSrc:"./assets/roomsImg/img3.jpg",
            title:"SINGLE ROOM",
            price:"155.00",
        },
    ];

}