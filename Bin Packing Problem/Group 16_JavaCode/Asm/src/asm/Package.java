package asm;

import java.util.*;

public class Package{
	
	private double length;
	private double height;
	private double width;
	private String id;
	private String type;
	private int quantity;

	public double getLength() {
		return length;
	}

	public void setLength(double length) {
		this.length = length;
	}

	public double getHeight() {
		return height;
	}

	public void setHeight(double height) {
		this.height = height;
	}

	public double getWidth() {
		return width;
	}

	public void setWidth(double width) {
		this.width = width;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	
	/*define package constructor*/
	public Package(String id, double l, double w, double h, String type, int quantity)
	{
		this.id = id;
		this.length = l;
		this.width = w;
		this.height = h;
		this.type = type;
		this.quantity = quantity;
	}
	
	/*define method computeVolume */
	public double computeVolume()
	{
		double volume = this.length * this.width * this.height;
		return volume;
	}

}

// sort the volume in descending order in queue
class VolumeComparator implements Comparator<Package> {
	public int compare(Package s1, Package s2) {
		if (s1.computeVolume() == s2.computeVolume())
			return 0;
		else if (s1.computeVolume() > s2.computeVolume())
			return -1;
		else
			return 1;
	}
	
}

//sort the volume in descending order in linkedHashMap
class MapVolumeComparator implements Comparator<Map.Entry<String, Package>> {
	public int compare(Map.Entry<String, Package> s1, Map.Entry<String, Package> s2) {
		if (s1.getValue().computeVolume() == s2.getValue().computeVolume())
			return 0;
		else if (s1.getValue().computeVolume() > s2.getValue().computeVolume())
			return -1;
		else
			return 1;
		}
}


