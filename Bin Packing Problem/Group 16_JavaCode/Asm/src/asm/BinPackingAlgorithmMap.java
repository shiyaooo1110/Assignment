package asm;

import java.util.*;

public class BinPackingAlgorithmMap {
	
	// Class for implementing First Fit and First Fit Decreasing algorithms using Map<String, Package>
	// Java program to find number of bins required using First Fit algorithm
	static int firstFit(Map<String, Package> packages, int n, double c)
	{
		// n = number of packages
		// c = capacity for each bins
		
	 // Initialize result (Count of bins)
	 int result = 0;

	 // Create an array to store bins
	 // Assume there can be at most n bins
	 Bin[] bins = new Bin[100];
			 
	 // Place items one by one
	 for(Map.Entry<String, Package> entry : packages.entrySet()) {
		 
	    // Find the first bin that can accommodate
		// Loop each quantity of the same package
		 for(int m = 0; m < entry.getValue().getQuantity(); m++) {
			 
			 int j;
		     for (j = 0; j < result; j++) 
		     {
	        	 // Assign the item if the remaining space is enough
		         if (bins[j].getSpaceRemain() >= entry.getValue().computeVolume())
		         {
		             bins[j].calculateRemain(entry.getValue().computeVolume()); // Calculate and update the remaining space of bin
		             bins[j].addItem(entry.getValue().getId()); // Add the package id into the related bin
		             break;
		         }
		     }

		     // If no bin could accommodate volume[i], then create a new bin
		     if (j == result)
		     {
		    	 bins[result] = new Bin(); //create a bin object
		         bins[result].calculateRemain(entry.getValue().computeVolume()); // Calculate and update the remaining space of bin
		         bins[result].addItem(entry.getValue().getId()); // Add the package id into the related bin
		         result++;
		     }
		 }
	};  
	 
	 
	 // Loop and display the packages in each bins
	 System.out.println("The basic volume of each bin is " + c);
	 System.out.println("The packages in each bin:");
	 for(int p = 0; p < result; p++) {
    	 System.out.println("Bin " + (p+1) + " = " + bins[p]);
     }
	 
	 return result; // Return the number of bins used
	}
	
	 // Java program to find number of bins required using First Fit Decreasing
	 // Returns number of bins required using first fit
	 static int firstFitDec(Map<String, Package> packages, int n, double c) 
	 {
		  // First, sort all volume in decreasing order using ArrayList
		  List<Map.Entry<String, Package>> pkg = new ArrayList<>(packages.entrySet());
		  pkg.sort(new MapVolumeComparator());
		  
		  // Rebuild the Map and maintain the sorted order
		  Map<String, Package> sortedMap = new LinkedHashMap<>();
		  for(Map.Entry<String, Package> entry : pkg)
			  sortedMap.put(entry.getKey(), entry.getValue());
			  
	     // Now call first fit for sorted items
	     return firstFit(sortedMap, n, c);
	 }
}


