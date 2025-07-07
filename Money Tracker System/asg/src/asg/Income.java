package asg;

public class Income extends Transaction{
	
	private String source;
		
		public Income(int year, int month, int day, double theAmount, String theSource)
		{
			super(year, month, day, theAmount);
			source = theSource;
		}
		
		public String getSource()
		{
			return source;
		}
		
		public void setSource(String aSource)
		{
			source = aSource;
		}

	}
