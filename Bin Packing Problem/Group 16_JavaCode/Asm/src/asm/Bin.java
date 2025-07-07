package asm;

import java.util.ArrayList;

public class Bin {
	
	/* Initialized the bin volume in cm */
	private final double binVolume = 130 * 115 * 110;
	// another test case
//    private final double binVolume = 135 * 110 * 100;
	private int binNumber = 0 ;
	private double spaceRemain;
	private ArrayList<String> items;
	
	
	public Bin() {
		/*Initialized the remaining space of bins will be equal to the bin volume when first created*/
		this.spaceRemain = binVolume; 
		this.items = new ArrayList<>();
	}
	
	/*Define method to add items into bin*/
	public void addItem(String id) {
		items.add(id);
	}
	
	public double getBinVolume() {
		return binVolume;
	}

	public int getBinNumber() {
		return binNumber;
	}
	
	public double getSpaceRemain() {
		return spaceRemain;
	}
	
	public ArrayList<String> getItems() {
		return items;
	}

	/*Define method to calculate the remaining space of bin*/
	public double calculateRemain(double packageVolume) {
		spaceRemain -= packageVolume;
		return spaceRemain;
	}
	
	@Override
	public String toString() {
        return "Packages : " + items.toString();
    }
	
}



