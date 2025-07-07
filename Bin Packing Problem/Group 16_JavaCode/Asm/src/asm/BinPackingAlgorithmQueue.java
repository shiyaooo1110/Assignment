package asm;

import java.util.*;

public class BinPackingAlgorithmQueue {
	
	// Class for implementing First Fit and First Fit Decreasing algorithms using Queue<Package>
		//Java program to find number of bins required using First Fit algorithm
		static int firstFit(Queue<Package> packages, int n, double c)
		{
			// n = number of packages
			// c = capacity for each bins
			
		 // Initialize result (Count of bins)
		 int result = 0;

		 // Create an array to store bins
		 // Assume there can be at most 100 bins
		 Bin[] bins = new Bin[100];
				 
		 // Place items one by one
		 for (Package pk : packages) 
		 {
		     // Find the first bin that can accommodate
			 // loop each quantity of the same package
			 for(int m = 0; m < pk.getQuantity(); m++) {
				 
				 int j;
			     for (j = 0; j < result; j++) 
			     {
		        	 // Assign the item if the remaining space is enough
			         if (bins[j].getSpaceRemain() >= pk.computeVolume())
			         {
			             bins[j].calculateRemain(pk.computeVolume()); // Calculate and update the remaining space of bin
			             bins[j].addItem(pk.getId()); // Add the package id into the related bin
			             break;
			         }
			     }

			     // If no bin could accommodate volume[i], then create a new bin
			     if (j == result)
			     {
			    	 bins[result] = new Bin(); 
			         bins[result].calculateRemain(pk.computeVolume()); // calculate and update the space remained
			         bins[result].addItem(pk.getId()); // add the package id into the related bin
			         result++;
			     }
			 }
		 }
		 
		 // Loop and display the packages in each bins
		 System.out.println("The basic volume of each bin is " + c);
		 System.out.println("The packages in each bin:");
		 for(int p = 0; p < result; p++) {
	    	 System.out.println("Bin " + (p+1) + " = " + bins[p]);
	     }
		 
		 return result; // return the number of bins used
		}
		
		 // Java program to find number of bins required using First Fit Decreasing 
		 // Returns number of bins required using first fit decreasing
		 static int firstFitDec(Queue<Package> packages, int n, double c) 
		 {
			  // Create a PriorityQueue to sort packages by descending volume
			  PriorityQueue<Package> pkg = new PriorityQueue<>(new VolumeComparator());
			  pkg.addAll(packages); 
			  
			  // Convert Priority Queue into Queue
			  Queue<Package> queuePackage = new LinkedList<>();
			  while(!pkg.isEmpty())
				  queuePackage.offer(pkg.poll());
		     
		     // Now call first fit for sorted items
		     return firstFit(queuePackage, n, c);
		 }

}
