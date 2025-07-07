package asm;

import java.util.*;
import java.io.*;

public class Warehouse {
	
	public static void main(String[] args) {
		
		// create a queue and a linkedHashMap to store the Package object
		Queue<Package> queuePackage = new LinkedList<>();
		Map<String, Package> linkedHashMapPackage = new LinkedHashMap<>();
		
		// declare the filename of data source
		String filename = "src/asm/Packages_Data.txt";
		
		try {
			// read the file
			Scanner input = new Scanner(new File(filename).getAbsoluteFile());
			String line;
			// read each line and create Package object
			while(input.hasNext()) {
				line = input.nextLine();
				String[] word = line.trim().split("\\s+");
		
				String id = word[0].trim();                          // store id in the word array with index 0, remove any spaces
				double height = Double.parseDouble(word[1].trim());  // Parse the second word (height) from the line, remove any spaces, and convert it from String to double
				double width = Double.parseDouble(word[2].trim());   // Parse the third word (width) from the line, remove any spaces, and convert it from String to double
				double length = Double.parseDouble(word[3].trim());  // Parse the fourth word (length) from the line, remove any spaces, and convert it from String to double
				String type = word[4].trim();                        // store type in the word array with index 4, remove any spaces
				int quantity = Integer.parseInt(word[5].trim());     // Parse the sixth word (quantity) from the line, remove any spaces, and convert it from String to double
		
				// create a new package 
				Package pk = new Package(id, length, width, height, type, quantity);
				
				// store it in both Queue and Map
				queuePackage.offer(pk);
				linkedHashMapPackage.put(id, pk);
				}
			
			// close the file
			input.close();
			
		} // if there is a exception, it will catch the exception and display different exception details
		catch(FileNotFoundException ex) {
			System.out.println("File not found: " + filename);
		} 
		catch(NumberFormatException ex) {
			System.out.println("Error parse the numeric: " + ex);
		} 
		catch(Exception ex) {
			System.out.println(ex.getMessage());
		}
		
		
		// Using Queue's First Fit algorithms in queue 
		int binFirstFit_queue = BinPackingAlgorithmQueue.firstFit(queuePackage, queuePackage.size(), 130 * 115 * 110);
		System.out.println("the number of bin used through first fit algorithms in queue is :" + binFirstFit_queue);
		System.out.println();
		
		// Using Queue's First Fit Decreasing algorithms in queue 
		int binFFD_queue = BinPackingAlgorithmQueue.firstFitDec(queuePackage, queuePackage.size(), 130 * 115 *110);
		System.out.println("The number of bin used through first fit decreasing algorithms in queue is :" + binFFD_queue);
		System.out.println();
		
		// Using linkedHashMap's First Fit algorithm in linkedHasHMap
		int binFirstFit_map = BinPackingAlgorithmMap.firstFit(linkedHashMapPackage, linkedHashMapPackage.size(), 130 * 115 *110);
		System.out.println("The number of bin used through first fit algorithms in map is :" + binFirstFit_map);
		System.out.println();
		
		// Using linkedHashMap's First Fit Decreasing algorithm in linkedHasHMap
		int binFFD_map = BinPackingAlgorithmMap.firstFitDec(linkedHashMapPackage, linkedHashMapPackage.size(), 130 * 115 *110);
		System.out.println("The number of bin used through first fit decreasing algorithms in map is :" + binFFD_map);
		System.out.println();
		
		
		
//		// Another test case of different bin volume
//		int binFirstFit_queue = BinPackingAlgorithmQueue.firstFit(queuePackage, queuePackage.size(), 135 * 110 * 100);
//		System.out.println("the number of bin used through first fit algorithms in queue is :" + binFirstFit_queue);
//		System.out.println();
//		
//		// Using Queue's First Fit Decreasing algorithms in queue 
//		int binFFD_queue = BinPackingAlgorithmQueue.firstFitDec(queuePackage, queuePackage.size(), 135 * 110 * 100);
//		System.out.println("The number of bin used through first fit decreasing algorithms in queue is :" + binFFD_queue);
//		System.out.println();
//		
//		// Using linkedHashMap's First Fit algorithm in linkedHashMap
//		int binFirstFit_map = BinPackingAlgorithmMap.firstFit(linkedHashMapPackage, linkedHashMapPackage.size(), 135 * 110 * 100);
//		System.out.println("The number of bin used through first fit algorithms in map is :" + binFirstFit_map);
//		System.out.println();
//		
//		// Using linkedHashMap's First Fit Decreasing algorithm in linkedHashMap
//		int binFFD_map = BinPackingAlgorithmMap.firstFitDec(linkedHashMapPackage, linkedHashMapPackage.size(), 135 * 110 * 100);
//		System.out.println("The number of bin used through first fit decreasing algorithms in map is :" + binFFD_map);
//		System.out.println();
	}

}


