// Xiaomin Guo  301495284  2025-9-27

package com.xiaomin.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class FlightBookingController {

    // Example pricing map (One-Way, symmetric)
    private static final Map<String, Double> oneWayPrices = new HashMap<>();
    static {
        oneWayPrices.put("Paris-Toronto", 1600.00);
        oneWayPrices.put("London-Toronto", 1500.00);
        oneWayPrices.put("New York-Toronto", 400.00);
        oneWayPrices.put("Amsterdam-Toronto", 1700.00);
        oneWayPrices.put("London-New York", 1200.00);
    }

    @GetMapping("/")
    public String showForm(Model model) {       
        List<String> locations = List.of("Toronto", "New York", "Paris", "London", "Amsterdam");
        List<String> nationality = List.of("Canadian", "American", "British", "Chinese", "French", "Dutch", 
        		"German", "Italian", "Spanish", "Japanese", "Indian", "Mexican", "Brazilian", "Australian", 
        	    "Russian", "South African", "Korean", "Turkish", "Egyptian", "Nigerian");
        List<String> airlines = List.of("Air Canada", "Delta", "American Airlines", "British Airways", "WestJet", "Air China");
        List<String> countries = List.of("Canada", "USA", "UK", "China", "France", "Netherlands",
        	    "Germany", "Italy", "Spain", "Japan", "India", "Mexico", "Brazil", "Australia",
        	    "Russia", "South Africa", "South Korea", "Turkey", "Egypt", "Nigeria");
        
        model.addAttribute("locations", locations);
        model.addAttribute("nationality", nationality);
        model.addAttribute("airlines", airlines);
        model.addAttribute("countries", countries);
        
        return "index";
    }

    @PostMapping("/bookFlight")
    public String processBooking(@ModelAttribute Booking booking, Model model) {
        double price = calculatePrice(booking);

        model.addAttribute("booking", booking);
        model.addAttribute("address", booking.getAddress());
        model.addAttribute("fullName", booking.getFullName());
        model.addAttribute("price", price);

        return "show-booking"; // Renders show-booking.html
    }

    // --- Pricing Logic ---
    private double calculatePrice(Booking booking) {
        String city1 = booking.getFrom();
        String city2 = booking.getTo();

        // Normalize route key (alphabetical order)
        String key = (city1.compareTo(city2) < 0) ? city1 + "-" + city2 : city2 + "-" + city1;

        double basePrice = oneWayPrices.getOrDefault(key, 1000.0); // default price

        // Round-trip surcharge
        if ("Round Trip".equalsIgnoreCase(booking.getTripType())) {
            basePrice += 350.0;
        }

        return basePrice * booking.getAdults(); // multiply by number of adult passengers
    }
}

